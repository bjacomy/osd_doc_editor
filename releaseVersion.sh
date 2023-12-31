# set your token
#export GITHUB_TOKEN=...

USER=$USER
REPO=$(basename $PWD)
BUILD_VERSION="1"
SKIP_INSTALL_DEPS="false"

# get the params
while getopts b:k:u:s option
do
    case "${option}"
    in
        b) BUILD_VERSION=${OPTARG};;
        k) opensearchdashboards_VERSION=${OPTARG};;
        u) USER=${OPTARG};;
        s) SKIP_INSTALL_DEPS="true"
    esac
done

# Check opensearchdashboards version
if [ -z ${opensearchdashboards_VERSION} ]; then
    echo -e "Options: -k <opensearchdashboards version> (mandatory)"
    echo -e "         -b <Build increment> (default to 1)"
    echo -e "         -u <User to log in Artifactory> (default to \$USER)"
    echo -e "         -s for skip dependencies install (default install deps)"
    exit;
fi

TAG_NAME=${opensearchdashboards_VERSION}-${BUILD_VERSION}
TAG_NAME_LATEST=${opensearchdashboards_VERSION}-latest

# Install (or not) dependencies
echo
if [ "${SKIP_INSTALL_DEPS}" = "false" ]; then
    echo "Install opensearchdashboards dependencies..."
    echo
    yarn osd bootstrap
else
    echo "Skip installing opensearchdashboards dependencies..."
fi

# Build packages
echo
echo "Build opensearchdashboards plugin package..."
echo
# yarn build -b ${TAG_NAME} -k ${opensearchdashboards_VERSION}

echo
echo "Create a package copy as latest..."
echo
echo "cp build/${REPO}-${TAG_NAME}.zip build/${REPO}-${TAG_NAME_LATEST}.zip"
# cp build/${REPO}-${TAG_NAME}.zip build/${REPO}-${TAG_NAME_LATEST}.zip

# Artifactory publish section

AF_REPO_FOR_ES="https://sfy-metriks-registry-prod.artifactory.si.francetelecom.fr/sfy-idem_generic_estack/opensearchdashboards/plugins" # verifier si path OK !

# Create tag and release

echo
echo "Create Git tag for the new release"
git tag -m "update to version ${opensearchdashboards_VERSION} : Get uploaded artifacts in artifactory ${AF_REPO_FOR_ES}/doc-editor" ${opensearchdashboards_VERSION} && git push --tags

PLUGINS=(
    "doc-editor" "doc-editor-${opensearchdashboards_VERSION}-latest.zip" ""
    "doc-editor" "doc-editor-${opensearchdashboards_VERSION}-${BUILD_VERSION}.zip" ""
)

if [ -z "$USER" ]
then
    echo "*** Error: variable USER is not set." >&2
    exit 1
fi

echo -n LDAP Password:
read -s password
echo

function upload() {
  for index in $(seq 0 3 $(( ${#PLUGINS[@]} - 3 ))); do
    src="./build/${PLUGINS[$(( $index + 1 ))]}"
    if [[ -f "${src}" ]]; then
      curl -kL -u "${USER}:${password}" -T "${src}" "${AF_REPO_FOR_ES}/${PLUGINS[$index]}/${PLUGINS[$(( $index + 1 ))]}"
    else
      echo "WARNING: Plugin '${src}' doesn't exists"
    fi
  done
}

upload
