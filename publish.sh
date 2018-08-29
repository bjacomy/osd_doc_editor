#!/bin/bash
AF_REPO_FOR_ES="https://sfy-metriks-registry-prod.af.multis.p.fti.net/sfy-idem_generic_estack/kibana/plugins"

PLUGINS=(
  "doc-editor" "doc-editor-6.3.2-1.zip" ""
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
