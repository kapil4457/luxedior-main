{{- define "sanity-studio.fullname" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end }}

{{- define "sanity-studio.labels" -}}
app.kubernetes.io/name: {{ include "sanity-studio.fullname" . }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "sanity-studio.selectorLabels" -}}
app.kubernetes.io/name: {{ include "sanity-studio.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
