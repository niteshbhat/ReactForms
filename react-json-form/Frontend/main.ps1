param (
    [string]$jsonInput
)

function New-MainTf {
    param (
        $data
    )

    $provider = $data.provider
    $resources = $data.resources

    $providerBlock = @"
provider "$($provider.name)" {
  region = var.region
}`n
"@

    $resourcesBlock = ""

    foreach ($resource in $resources) {
        $resourceBlock = @"
resource "$($resource.type)" "$($resource.name)" {
"@
        foreach ($key in $resource.properties.Keys) {
            $resourceBlock += "  $key = $($resource.properties.$key)`n"
        }
        $resourceBlock += @"
`n tags = {
    Name = var.instance_name
  }
}`n
"@ 
        $resourcesBlock += $resourceBlock
    }

    $content = $providerBlock + $resourcesBlock
    Set-Content -Path "E:\React_Test\main.tf" -Value $content
}

function New-VariablesTf {
    param (
        [PSCustomObject]$data
    )

    $variables = $data.variables

    $variablesBlock = ""

    foreach ($var in $variables) {
        $default = if ($var.ContainsKey('default')) { "  default     = `"$($var.default)`"" } else { "" }
        $variableBlock = @"
variable "$($var.name)" {
  description = "$($var.description)"
  type        = $($var.type)
$default
}`n
"@
        $variablesBlock += $variableBlock
    }

    Set-Content -Path "E:\React_Test\variables.tf" -Value $variablesBlock
}

function New-OutputsTf {
    param (
        [PSCustomObject]$data
    )

    $outputs = $data.outputs

    $outputsBlock = ""

    foreach ($output in $outputs) {
        $outputBlock = @"
output "$($output.name)" {
  description = "$($output.description)"
  value       = $($output.value)
}`n
"@
        $outputsBlock += $outputBlock
    }

    Set-Content -Path "E:\React_Test\outputs.tf" -Value $outputsBlock
}

function Main {
    param (
        $jsonInput
    )

    $data = $jsonInput | ConvertFrom-Json
    New-MainTf -data $data
    New-VariablesTf -data $data
    New-OutputsTf -data $data
    Write-Output "Terraform files have been generated successfully."
}
$jsonInput = gc E:\CyberTerminator-Solution\ReactForms\react-json-form\Backend\example.json
Main -jsonInput $jsonInput
