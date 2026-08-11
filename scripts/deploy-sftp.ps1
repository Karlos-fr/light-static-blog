<#
.SYNOPSIS
  Deploie le site statique genere par Light Static Blog vers un serveur SFTP.

.DESCRIPTION
  Ce script est volontairement generique : aucune URL, aucun chemin distant et
  aucune cle SSH ne sont codes en dur. Les identifiants SFTP sont lus depuis un
  profil FileZilla existant, puis le dossier dist/ est transfere et verifie par
  empreinte SHA-256.

  Le deploiement suit cinq etapes :
  1. build Astro optionnel ;
  2. controles SEO/flux avant transfert ;
  3. preparation SFTP ;
  4. transfert + verification distante ;
  5. controles HTTP publics.

  Par defaut, la sortie detaillee du build Astro est masquee pour garder un
  rendu console propre. Utiliser -VerboseBuild pour l'afficher en direct.

.EXAMPLE
  ./scripts/deploy-sftp.ps1 `
    -Site 'https://example.com' `
    -BasePath '/blog/' `
    -AuthorName 'Author name' `
    -SftpHost 'ftp.example.com' `
    -RemoteRoot '/home/example/www/blog' `
    -ExpectedHostKeySha256 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

.NOTES
  Dependances :
  - Node.js et npm pour le build Astro ;
  - Python avec le module paramiko ;
  - un profil FileZilla contenant les identifiants du serveur SFTP.
#>

param(
  [switch]$SkipBuild,
  [switch]$VerboseBuild,
  [Parameter(Mandatory = $true)][string]$Site,
  [Parameter(Mandatory = $true)][string]$BasePath,
  [Parameter(Mandatory = $true)][string]$AuthorName,
  [string]$SiteName = 'Light Static Blog',
  [string]$SiteHomeMetaTitle = '',
  [string]$SiteTagline = '',
  [string]$SiteDescription = 'Static blog generated with Light Static Blog.',
  [string]$SiteSocialImage = '/images/social-card.png',
  [string]$SiteFeedTitle = '',
  [string]$SiteFeedDescription = '',
  [string]$SiteFeedIcon = '/images/feed-icon.png',
  [string]$SiteFeedLogo = '/images/feed-icon.png',
  [string]$SiteFeedAccentColor = '#f26522',
  [string]$SiteTheme = 'default',
  [Parameter(Mandatory = $true)][string]$SftpHost,
  [Parameter(Mandatory = $true)][string]$RemoteRoot,
  [string]$RemoteHostRoot = '',
  [string]$RootRobotsRemotePath = '',
  [Parameter(Mandatory = $true)][string]$ExpectedHostKeySha256,
  [string]$FileZillaConfig = (Join-Path $env:APPDATA 'FileZilla\sitemanager.xml'),
  [string]$FileZillaHost = '',
  [string[]]$CheckUrls = @()
)

$ErrorActionPreference = 'Stop'

# Force un rendu UTF-8 correct dans la console Windows.
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)

# Chemins et valeurs derivees a partir des parametres publics du script.
$Script:StartedAt = Get-Date
$Script:ProgressLineActive = $false
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$DistPath = Join-Path $ProjectRoot 'dist'
$ResolvedFileZillaHost = if ($FileZillaHost) { $FileZillaHost } else { $SftpHost }
$NormalizedSite = $Site.TrimEnd('/')
$NormalizedBasePath = if ($BasePath.EndsWith('/')) { $BasePath } else { "$BasePath/" }
$PublicRoot = "$NormalizedSite$NormalizedBasePath"
$EffectiveSiteHomeMetaTitle = if ($SiteHomeMetaTitle) { $SiteHomeMetaTitle } else { "$SiteName | Blog" }
$EffectiveSiteFeedTitle = if ($SiteFeedTitle) { $SiteFeedTitle } else { $SiteName }
$EffectiveSiteFeedDescription = if ($SiteFeedDescription) { $SiteFeedDescription } else { $SiteDescription }
$CliWidth = 74
$BoxBackground = [ConsoleColor]::DarkBlue

# Helpers d'affichage : garder toute la decoration console au meme endroit rend
# le script plus lisible et facilite la personnalisation du theme console.
function Write-DeployLine {
  param(
    [string]$Text = '',
    [ConsoleColor]$Color = [ConsoleColor]::Gray
  )

  Write-Host $Text -ForegroundColor $Color
}

function Format-CliText {
  param(
    [string]$Text,
    [int]$Width,
    [switch]$Center
  )

  if ($Text.Length -gt $Width) {
    return $Text.Substring(0, [Math]::Max(0, $Width - 3)) + '...'
  }

  if ($Center) {
    $Left = [Math]::Floor(($Width - $Text.Length) / 2)
    $Right = $Width - $Text.Length - $Left
    return (' ' * $Left) + $Text + (' ' * $Right)
  }

  return $Text + (' ' * ($Width - $Text.Length))
}

function Write-BoxLine {
  param(
    [string]$Text = '',
    [ConsoleColor]$Color = [ConsoleColor]::White,
    [ConsoleColor]$BackgroundColor = $BoxBackground,
    [ConsoleColor]$BorderColor = [ConsoleColor]::Cyan,
    [switch]$Center
  )

  $Vertical = [string][char]0x2502
  $InnerWidth = $CliWidth - 2
  $Rendered = Format-CliText -Text $Text -Width $InnerWidth -Center:$Center
  Write-Host $Vertical -ForegroundColor $BorderColor -BackgroundColor $BackgroundColor -NoNewline
  Write-Host $Rendered -ForegroundColor $Color -BackgroundColor $BackgroundColor -NoNewline
  Write-Host $Vertical -ForegroundColor $BorderColor -BackgroundColor $BackgroundColor
}

function Write-BoxRule {
  param(
    [ConsoleColor]$Color = [ConsoleColor]::Cyan,
    [ConsoleColor]$BackgroundColor = $BoxBackground
  )

  $Left = [string][char]0x250C
  $Right = [string][char]0x2510
  $Horizontal = [string][char]0x2500
  Write-Host ($Left + ($Horizontal * ($CliWidth - 2)) + $Right) -ForegroundColor $Color -BackgroundColor $BackgroundColor
}

function Write-BoxBottomRule {
  param(
    [ConsoleColor]$Color = [ConsoleColor]::Cyan,
    [ConsoleColor]$BackgroundColor = $BoxBackground
  )

  $Left = [string][char]0x2514
  $Right = [string][char]0x2518
  $Horizontal = [string][char]0x2500
  Write-Host ($Left + ($Horizontal * ($CliWidth - 2)) + $Right) -ForegroundColor $Color -BackgroundColor $BackgroundColor
}

function Write-DeployHeader {
  Clear-Host
  Write-BoxRule Cyan
  Write-BoxLine 'Light Static Blog - SFTP Deploy' Cyan -BorderColor Cyan -Center
  Write-BoxBottomRule Cyan
  Write-DeployLine ''
  Write-BoxRule DarkGray
  Write-BoxLine "Site    $PublicRoot" Gray -BorderColor DarkGray
  Write-BoxLine "Host    $SftpHost" Gray -BorderColor DarkGray
  Write-BoxLine "Remote  $RemoteRoot" Gray -BorderColor DarkGray
  Write-BoxLine "Theme   $SiteTheme" Gray -BorderColor DarkGray
  Write-BoxLine "RSS     $EffectiveSiteFeedTitle" Gray -BorderColor DarkGray
  Write-BoxBottomRule DarkGray
  Write-DeployLine ''
}

function Write-Step {
  param(
    [int]$Index,
    [int]$Total,
    [string]$Title
  )

  Write-DeployLine ''
  $StepBackground = [ConsoleColor]::DarkCyan
  $StepText = "[{0}/{1}] {2}" -f $Index, $Total, $Title.ToUpperInvariant()
  Write-BoxRule Cyan -BackgroundColor $StepBackground
  Write-BoxLine $StepText White -BackgroundColor $StepBackground -BorderColor Cyan
  Write-BoxBottomRule Cyan -BackgroundColor $StepBackground
}

function Write-Ok {
  param([string]$Text)
  Write-DeployLine "  [OK] $Text" Green
}

function Write-Info {
  param([string]$Text)
  Write-DeployLine "  [..] $Text" DarkGray
}

function Write-Fail {
  param([string]$Text)
  Write-DeployLine "  [!!] $Text" Red
}

function Write-CapturedOutput {
  param([object[]]$Output)

  foreach ($Line in $Output) {
    if ($null -ne $Line -and "$Line".Trim()) {
      Write-DeployLine "      $Line" DarkGray
    }
  }
}

function Write-ProgressLine {
  param(
    [string]$Label,
    [int]$Current,
    [int]$Total,
    [int64]$Bytes = 0,
    [int64]$TotalBytes = 0
  )

  $Percent = if ($Total -gt 0) {
    [Math]::Min(100, [Math]::Round(($Current / $Total) * 100))
  } else {
    0
  }
  $ByteText = if ($TotalBytes -gt 0) {
    ' | {0:N2}/{1:N2} Mo' -f ($Bytes / 1MB), ($TotalBytes / 1MB)
  } else {
    ''
  }
  $Text = '  [..] {0} {1}/{2} ({3,3}%){4}' -f $Label, $Current, $Total, $Percent, $ByteText
  $Rendered = Format-CliText -Text $Text -Width $CliWidth

  Write-Host "`r$Rendered" -ForegroundColor DarkGray -NoNewline
  $Script:ProgressLineActive = $true
}

function Complete-ProgressLine {
  if ($Script:ProgressLineActive) {
    Write-Host ''
    $Script:ProgressLineActive = $false
  }
}

# Verifie la presence d'un fichier critique et leve une erreur lisible.
function Assert-File {
  param(
    [string]$Path,
    [string]$Message
  )

  if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
    throw $Message
  }
}

# Injecte la configuration publique du site dans l'environnement attendu par
# Astro et par la configuration applicative.
function Set-BuildEnvironment {
  $env:SITE = $NormalizedSite
  $env:BASE_PATH = $NormalizedBasePath
  $env:AUTHOR_NAME = $AuthorName
  $env:SITE_NAME = $SiteName
  $env:SITE_HOME_META_TITLE = $EffectiveSiteHomeMetaTitle
  $env:SITE_TAGLINE = $SiteTagline
  $env:SITE_DESCRIPTION = $SiteDescription
  $env:SITE_SOCIAL_IMAGE = $SiteSocialImage
  $env:SITE_FEED_TITLE = $EffectiveSiteFeedTitle
  $env:SITE_FEED_DESCRIPTION = $EffectiveSiteFeedDescription
  $env:SITE_FEED_ICON = $SiteFeedIcon
  $env:SITE_FEED_LOGO = $SiteFeedLogo
  $env:SITE_FEED_ACCENT_COLOR = $SiteFeedAccentColor
  $env:SITE_THEME = $SiteTheme
}

# Nettoie uniquement les variables ajoutees par ce script pour eviter de polluer
# la session PowerShell apres un deploiement ou une erreur.
function Clear-DeployEnvironment {
  @(
    'DEPLOY_PROJECT_ROOT',
    'DEPLOY_FILEZILLA_CONFIG',
    'DEPLOY_FILEZILLA_HOST',
    'DEPLOY_SFTP_HOST',
    'DEPLOY_REMOTE_ROOT',
    'DEPLOY_REMOTE_HOST_ROOT',
    'DEPLOY_ROOT_ROBOTS_REMOTE_PATH',
    'DEPLOY_EXPECTED_HOST_KEY',
    'SITE_NAME',
    'SITE_HOME_META_TITLE',
    'SITE_TAGLINE',
    'SITE_DESCRIPTION',
    'SITE_SOCIAL_IMAGE',
    'SITE_FEED_TITLE',
    'SITE_FEED_DESCRIPTION',
    'SITE_FEED_ICON',
    'SITE_FEED_LOGO',
    'SITE_FEED_ACCENT_COLOR'
  ) | ForEach-Object {
    Remove-Item "Env:$_" -ErrorAction SilentlyContinue
  }
}

Write-DeployHeader
Push-Location $ProjectRoot
try {
  $TotalSteps = if ($SkipBuild) { 4 } else { 5 }
  $Step = 1

  if (-not $SkipBuild) {
    # Le build utilise les parametres passes au script afin de garantir que RSS,
    # sitemap, canonical et JSON-LD ciblent exactement l'URL de production.
    Write-Step $Step $TotalSteps 'Build et validation Astro'
    Set-BuildEnvironment
    Write-Info 'npm run validate'

    if ($VerboseBuild) {
      & npm.cmd run validate
      $BuildExitCode = $LASTEXITCODE
      $BuildOutput = @()
    } else {
      $BuildOutput = & npm.cmd run validate 2>&1
      $BuildExitCode = $LASTEXITCODE
    }

    if ($BuildExitCode -ne 0) {
      if (-not $VerboseBuild) {
        Write-DeployLine ''
        Write-Fail 'Sortie du build'
        Write-CapturedOutput $BuildOutput
      }
      throw 'La validation du site a echoue.'
    }

    Write-Ok 'Build valide'
    $Step++
  }

  Write-Step $Step $TotalSteps 'Controles pre-deploiement'
  # Ces controles evitent de publier un build coherent localement mais faux pour
  # la production : mauvais BASE_PATH, mauvais SITE, JSON-LD incomplet, etc.
  if (-not (Test-Path -LiteralPath $DistPath -PathType Container)) {
    throw "Le dossier de build est absent : $DistPath"
  }

  $RssPath = Join-Path $DistPath 'rss.xml'
  $SitemapPath = Join-Path $DistPath 'sitemap.xml'
  $RobotsPath = Join-Path $DistPath 'robots.txt'
  $ThemePath = Join-Path $DistPath 'styles\theme.css'

  Assert-File $RssPath "Le flux RSS genere est absent : $RssPath"
  Assert-File $SitemapPath "Le sitemap genere est absent : $SitemapPath"
  Assert-File $RobotsPath "Le robots.txt genere est absent : $RobotsPath"
  Assert-File $ThemePath "La feuille de theme generee est absente : $ThemePath"

  $RobotsContent = Get-Content -Raw -LiteralPath $RobotsPath
  if (-not $RobotsContent.Contains("Sitemap: ${PublicRoot}sitemap.xml")) {
    throw "Le robots.txt genere ne reference pas le sitemap attendu : ${PublicRoot}sitemap.xml"
  }

  $RssContent = Get-Content -Raw -LiteralPath $RssPath
  if (-not $RssContent.Contains("<link>$PublicRoot</link>")) {
    throw "Le flux RSS ne cible pas $PublicRoot. Relancer sans -SkipBuild."
  }

  $SitemapContent = Get-Content -Raw -LiteralPath $SitemapPath
  $SitemapLocations = [regex]::Matches($SitemapContent, '<loc>([^<]+)</loc>')
  if ($SitemapLocations.Count -eq 0) {
    throw 'Le sitemap genere ne contient aucune URL.'
  }
  foreach ($Location in $SitemapLocations) {
    if (-not $Location.Groups[1].Value.StartsWith($PublicRoot)) {
      throw "Le sitemap contient une URL hors cible : $($Location.Groups[1].Value)"
    }
  }

  $GeneratedHtmlFiles = Get-ChildItem -LiteralPath $DistPath -Recurse -File -Filter '*.html'
  $StructuredPages = 0
  foreach ($HtmlFile in $GeneratedHtmlFiles) {
    $HtmlContent = Get-Content -Raw -LiteralPath $HtmlFile.FullName
    $Canonical = [regex]::Match($HtmlContent, '<link rel="canonical" href="([^"]+)"')
    if (-not $Canonical.Success) {
      throw "URL canonique absente : $($HtmlFile.FullName)"
    }
    if (-not $Canonical.Groups[1].Value.StartsWith($PublicRoot)) {
      throw "URL canonique hors cible : $($Canonical.Groups[1].Value)"
    }

    $JsonLd = [regex]::Match(
      $HtmlContent,
      '<script type="application/ld\+json">(.*?)</script>',
      [System.Text.RegularExpressions.RegexOptions]::Singleline
    )
    if ($JsonLd.Success) {
      $StructuredData = $JsonLd.Groups[1].Value | ConvertFrom-Json
      if ($StructuredData.'@type' -in @('WebSite', 'BlogPosting')) {
        if ($StructuredData.author.name -ne $AuthorName) {
          throw "Auteur JSON-LD incorrect dans $($HtmlFile.FullName)"
        }
        $StructuredPages++
      }
    }
  }
  if ($StructuredPages -lt 2) {
    throw 'Les donnees JSON-LD WebSite et BlogPosting sont absentes du build.'
  }

  $LocalFiles = Get-ChildItem -LiteralPath $DistPath -Recurse -File
  $LocalBytes = ($LocalFiles | Measure-Object -Property Length -Sum).Sum
  Write-Ok "$($LocalFiles.Count) fichiers prets"
  Write-Info ("{0:N2} Mo a transferer" -f ($LocalBytes / 1MB))
  $Step++

  Write-Step $Step $TotalSteps 'Preparation SFTP'
  # Les identifiants ne sont pas stockes dans le repo : ils sont recuperes depuis
  # FileZilla, qui sert ici de coffre local deja configure par l'utilisateur.
  Assert-File $FileZillaConfig "Le profil FileZilla est introuvable : $FileZillaConfig"

  & python -c 'import paramiko' 2>$null
  if ($LASTEXITCODE -ne 0) {
    throw 'Le module Python paramiko est requis. Installation : python -m pip install --user paramiko'
  }

  Write-Ok 'Profil FileZilla trouve'
  Write-Ok 'Module Python paramiko disponible'
  $Step++

  Write-Step $Step $TotalSteps 'Transfert et verification SHA-256'
  # Les donnees sensibles ou specifiques au serveur sont transmises au bloc
  # Python par variables d'environnement, ce qui evite de generer un fichier
  # temporaire contenant les identifiants.
  $env:DEPLOY_PROJECT_ROOT = $ProjectRoot
  $env:DEPLOY_FILEZILLA_CONFIG = $FileZillaConfig
  $env:DEPLOY_FILEZILLA_HOST = $ResolvedFileZillaHost
  $env:DEPLOY_SFTP_HOST = $SftpHost
  $env:DEPLOY_REMOTE_ROOT = $RemoteRoot
  $env:DEPLOY_REMOTE_HOST_ROOT = $RemoteHostRoot
  $env:DEPLOY_ROOT_ROBOTS_REMOTE_PATH = $RootRobotsRemotePath
  $env:DEPLOY_EXPECTED_HOST_KEY = $ExpectedHostKeySha256

  @'
import base64
import hashlib
import os
import posixpath
import stat
from pathlib import Path
import xml.etree.ElementTree as ET

import paramiko

# Paramiko gere la connexion SFTP et expose un acces bas niveau suffisant pour
# creer les dossiers, transferer les fichiers et relire les contenus distants.
project_root = Path(os.environ['DEPLOY_PROJECT_ROOT'])
local_root = project_root / 'dist'
config_path = Path(os.environ['DEPLOY_FILEZILLA_CONFIG'])
filezilla_host = os.environ['DEPLOY_FILEZILLA_HOST']
host = os.environ['DEPLOY_SFTP_HOST']
remote_root = posixpath.normpath(os.environ['DEPLOY_REMOTE_ROOT'])
remote_host_root = posixpath.normpath(os.environ.get('DEPLOY_REMOTE_HOST_ROOT') or '')
root_robots_remote_path = posixpath.normpath(os.environ.get('DEPLOY_ROOT_ROBOTS_REMOTE_PATH') or '')
expected_host_key = os.environ['DEPLOY_EXPECTED_HOST_KEY'].replace('SHA256:', '')

server = next(
    (
        item
        for item in ET.parse(config_path).getroot().findall('.//Server')
        if item.findtext('Host', '') == filezilla_host
    ),
    None,
)
if server is None:
    raise RuntimeError(f'Profil FileZilla introuvable pour {filezilla_host}')

# FileZilla peut stocker le mot de passe en clair ou encode en base64 selon la
# version/configuration. Les deux cas courants sont supportes.
user = server.findtext('User', '')
password_node = server.find('Pass')
if not user or password_node is None or not password_node.text:
    raise RuntimeError('Identifiants absents du profil FileZilla')

password = password_node.text
encoding = password_node.get('encoding', 'plain')
if encoding == 'base64':
    password = base64.b64decode(password).decode('utf-8')
elif encoding != 'plain':
    raise RuntimeError(f'Encodage de mot de passe FileZilla non pris en charge : {encoding}')

port = int(server.findtext('Port', '22'))
local_files = sorted(path for path in local_root.rglob('*') if path.is_file())
if not local_files:
    raise RuntimeError('Le dossier dist ne contient aucun fichier')
total_files = len(local_files) + (1 if root_robots_remote_path else 0)
total_bytes = sum(path.stat().st_size for path in local_files)
if root_robots_remote_path:
    total_bytes += (local_root / 'robots.txt').stat().st_size

transport = paramiko.Transport((host, port))
try:
    transport.start_client(timeout=20)
    server_key = transport.get_remote_server_key()
    fingerprint = base64.b64encode(
        hashlib.sha256(server_key.asbytes()).digest()
    ).decode('ascii').rstrip('=')
    if fingerprint != expected_host_key:
        raise RuntimeError(f'Cle SSH inattendue : SHA256:{fingerprint}')

    transport.auth_password(user, password)
    sftp = paramiko.SFTPClient.from_transport(transport)

    # Creation recursive minimale cote serveur. Si un element existe mais n'est
    # pas un dossier, on echoue explicitement au lieu d'ecraser quoi que ce soit.
    def ensure_directory(path):
        current = '/'
        for part in path.strip('/').split('/'):
            if not part:
                continue
            current = posixpath.join(current, part)
            try:
                mode = sftp.lstat(current).st_mode
                if not stat.S_ISDIR(mode):
                    raise RuntimeError(f'La cible distante n est pas un dossier : {current}')
            except FileNotFoundError:
                sftp.mkdir(current)

    ensure_directory(remote_root)
    uploaded_bytes = 0

    # Transfert miroir simple de dist/ vers RemoteRoot. Chaque chemin distant est
    # normalise et controle pour rester sous la cible declaree.
    uploaded_count = 0
    for local_path in local_files:
        relative_path = local_path.relative_to(local_root).as_posix()
        remote_path = posixpath.normpath(posixpath.join(remote_root, relative_path))
        if remote_path != remote_root and not remote_path.startswith(remote_root + '/'):
            raise RuntimeError(f'Chemin distant refuse : {remote_path}')
        ensure_directory(posixpath.dirname(remote_path))
        sftp.put(str(local_path), remote_path)
        uploaded_count += 1
        uploaded_bytes += local_path.stat().st_size
        print(f'UPLOAD_PROGRESS={uploaded_count}|{total_files}|{uploaded_bytes}|{total_bytes}', flush=True)

    if root_robots_remote_path:
        # Option utile quand le blog vit dans un sous-repertoire : les moteurs
        # cherchent robots.txt a la racine de l'hote, pas sous BASE_PATH.
        local_robots_path = local_root / 'robots.txt'
        ensure_directory(posixpath.dirname(root_robots_remote_path))
        sftp.put(str(local_robots_path), root_robots_remote_path)
        uploaded_bytes += local_robots_path.stat().st_size
        uploaded_count += 1
        print(f'UPLOAD_PROGRESS={uploaded_count}|{total_files}|{uploaded_bytes}|{total_bytes}', flush=True)

    # Relecture des fichiers distants pour comparer les empreintes SHA-256 : le
    # transfert n'est considere reussi que si les octets publies correspondent.
    verified_count = 0
    verified_bytes = 0
    for local_path in local_files:
        relative_path = local_path.relative_to(local_root).as_posix()
        remote_path = posixpath.normpath(posixpath.join(remote_root, relative_path))
        local_hash = hashlib.sha256(local_path.read_bytes()).digest()
        with sftp.open(remote_path, 'rb') as remote_file:
            remote_hash = hashlib.sha256(remote_file.read()).digest()
        if local_hash != remote_hash:
            raise RuntimeError(f'Controle SHA-256 echoue : {relative_path}')
        verified_count += 1
        verified_bytes += local_path.stat().st_size
        print(f'VERIFY_PROGRESS={verified_count}|{total_files}|{verified_bytes}|{total_bytes}', flush=True)

    if root_robots_remote_path:
        local_robots_hash = hashlib.sha256((local_root / 'robots.txt').read_bytes()).digest()
        with sftp.open(root_robots_remote_path, 'rb') as remote_file:
            remote_robots_hash = hashlib.sha256(remote_file.read()).digest()
        if local_robots_hash != remote_robots_hash:
            raise RuntimeError('Controle SHA-256 echoue : robots.txt racine')
        verified_count += 1
        verified_bytes += (local_root / 'robots.txt').stat().st_size
        print(f'VERIFY_PROGRESS={verified_count}|{total_files}|{verified_bytes}|{total_bytes}', flush=True)

    print(f'SSH_FINGERPRINT=SHA256:{fingerprint}')
    print(f'UPLOADED_FILES={uploaded_count}')
    print(f'UPLOADED_BYTES={uploaded_bytes}')
finally:
    transport.close()
'@ | python - | ForEach-Object {
    if ($_ -like 'SSH_FINGERPRINT=*') {
      Complete-ProgressLine
      Write-Ok ($_.Replace('SSH_FINGERPRINT=', 'Cle SSH verifiee : '))
    } elseif ($_ -like 'UPLOADED_FILES=*') {
      Write-Ok ($_.Replace('UPLOADED_FILES=', 'Fichiers transferes et verifies : '))
    } elseif ($_ -like 'UPLOADED_BYTES=*') {
      $Bytes = [int64]$_.Replace('UPLOADED_BYTES=', '')
      Write-Info ("Volume transfere : {0:N2} Mo" -f ($Bytes / 1MB))
    } elseif ($_ -like 'UPLOAD_PROGRESS=*') {
      $Parts = $_.Replace('UPLOAD_PROGRESS=', '').Split('|')
      Write-ProgressLine `
        -Label 'Transfert' `
        -Current ([int]$Parts[0]) `
        -Total ([int]$Parts[1]) `
        -Bytes ([int64]$Parts[2]) `
        -TotalBytes ([int64]$Parts[3])
    } elseif ($_ -like 'VERIFY_PROGRESS=*') {
      $Parts = $_.Replace('VERIFY_PROGRESS=', '').Split('|')
      Write-ProgressLine `
        -Label 'Verification' `
        -Current ([int]$Parts[0]) `
        -Total ([int]$Parts[1]) `
        -Bytes ([int64]$Parts[2]) `
        -TotalBytes ([int64]$Parts[3])
    } else {
      Complete-ProgressLine
      Write-DeployLine "  $_" Gray
    }
  }

  if ($LASTEXITCODE -ne 0) {
    throw 'Le transfert SFTP a echoue.'
  }
  $Step++

  Write-Step $Step $TotalSteps 'Controles HTTP publics'
  # Derniere garde : on verifie ce qui est reellement servi par le domaine, pas
  # seulement ce qui a ete envoye par SFTP.
  $DefaultUrls = @(
    $PublicRoot,
    "${PublicRoot}rss.xml",
    "${PublicRoot}sitemap.xml"
  )
  if ($RootRobotsRemotePath) {
    $DefaultUrls = @("$NormalizedSite/robots.txt") + $DefaultUrls
  }
  $UrlsToCheck = if ($CheckUrls.Count -gt 0) { $CheckUrls } else { $DefaultUrls }

  foreach ($Url in $UrlsToCheck) {
    $Response = Invoke-WebRequest `
      -Uri $Url `
      -Method Get `
      -Headers @{ 'Cache-Control' = 'no-cache' }

    if ($Response.StatusCode -ne 200) {
      throw "Controle HTTP echoue ($($Response.StatusCode)) : $Url"
    }

    Write-Ok "200 $Url"
  }

  $Elapsed = (Get-Date) - $Script:StartedAt
  $ElapsedText = $Elapsed.ToString('mm\:ss')
  Write-DeployLine ''
  Write-BoxRule Green
  Write-BoxLine 'Deploiement termine avec succes' Green -BorderColor Green -Center
  Write-BoxLine "Duree   $ElapsedText" Gray -BorderColor Green
  Write-BoxLine "URL     $PublicRoot" Gray -BorderColor Green
  Write-BoxBottomRule Green
}
catch {
  Write-DeployLine ''
  Write-Fail $_.Exception.Message
  throw
}
finally {
  Clear-DeployEnvironment
  Pop-Location
}
