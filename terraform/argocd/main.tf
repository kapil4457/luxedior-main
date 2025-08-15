
provider "helm" {
  kubernetes = {
    config_path = "~/.kube/config"
  }
}
resource "helm_release" "argo" {
  name              = "argocd"
  namespace         = "argocd"
  repository        = "https://argoproj.github.io/argo-helm"
  chart             = "argo-cd"
  version           = "5.0.0"
  create_namespace  = true
  timeout           = 600

  values = [
    <<EOF
    controller:
      replicaCount: 3
      tolerations:
        - key: "eks.amazonaws.com/compute-type"
          operator: "Equal"
          value: "fargate"
          effect: "NoSchedule"

    server:
      service:
        type: LoadBalancer
        port: 80
        targetPort: 8080  

    rbac:
      enabled: true 

    repoServer:
      replicaCount: 2

    dex:
      enabled: false 

    ingress:
      enabled: false
    EOF
  ]
}
