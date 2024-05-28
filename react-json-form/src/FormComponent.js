import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { saveAs } from 'file-saver';
import './FormComponent.css';

const awsRegions = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'af-south-1', 'ap-east-1', 'ap-south-1', 'ap-northeast-1',
  'ap-northeast-2', 'ap-northeast-3', 'ap-southeast-1', 'ap-southeast-2',
  'ca-central-1', 'cn-north-1', 'cn-northwest-1', 'eu-central-1',
  'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-north-1', 'eu-south-1',
  'me-south-1', 'sa-east-1'
];

const awsInstanceTypes = [
  't2.micro', 't2.small', 't2.medium', 't2.large',
  't3.micro', 't3.small', 't3.medium', 't3.large',
  'm5.large', 'm5.xlarge', 'm5.2xlarge', 'm5.4xlarge',
  'c5.large', 'c5.xlarge', 'c5.2xlarge', 'c5.4xlarge'
];

const AddAwsConfigurationForm = () => {
  const [region, setRegion] = useState('us-west-2');
  const [instanceType, setInstanceType] = useState('t2.micro');
  const [instanceName, setInstanceName] = useState('ExampleInstance');
  const [ami, setAmi] = useState('ami-12345678');
  const [resourceName, setResourceName] = useState('example');
  const [instanceIdDescription, setInstanceIdDescription] = useState('The ID of the EC2 instance');
  const [publicIpDescription, setPublicIpDescription] = useState('The public IP of the EC2 instance');

  const generateJSON = () => {
    return {
      provider: {
        name: 'aws',
      },
      variables: [
        {
          name: 'region',
          description: 'The AWS region to deploy in',
          type: 'string',
          default: region,
        },
        {
          name: 'instance_type',
          description: 'The type of instance to use',
          type: 'string',
          default: instanceType,
        },
        {
          name: 'instance_name',
          description: 'The name of the instance',
          type: 'string',
          default: instanceName,
        },
      ],
      resources: [
        {
          type: 'aws_instance',
          name: resourceName,
          properties: {
            ami: 'var.ami',
            instance_type: 'var.instance_type',
          },
        },
      ],
      outputs: [
        {
          name: 'instance_id',
          description: instanceIdDescription,
          value: 'aws_instance.example.id',
        },
        {
          name: 'public_ip',
          description: publicIpDescription,
          value: 'aws_instance.example.public_ip',
        },
      ],
    };
  };

  const handleDownload = () => {
    const json = generateJSON();
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'aws_configuration.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = () => {
    const json = generateJSON();
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    saveAs(blob, 'example.json');

    // Trigger the PowerShell script
    fetch('http://localhost:5000/start-powershell', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ script: 'main.ps1' }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('PowerShell script started successfully!');
        } else {
          alert('Error starting PowerShell script');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error starting PowerShell script');
      });
  };

  return (
    <div className="form-container">
      <form>
        <div className="form-row">
          <div className="form-group">
            <label>Region:</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              {awsRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Instance Type:</label>
            <select value={instanceType} onChange={(e) => setInstanceType(e.target.value)}>
              {awsInstanceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Instance Name:</label>
            <input type="text" value={instanceName} onChange={(e) => setInstanceName(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Resource Name:</label>
            <input type="text" value={resourceName} onChange={(e) => setResourceName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>AMI:</label>
            <input type="text" value={ami} onChange={(e) => setAmi(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Instance ID Description:</label>
            <input type="text" value={instanceIdDescription} onChange={(e) => setInstanceIdDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Public IP Description:</label>
            <input type="text" value={publicIpDescription} onChange={(e) => setPublicIpDescription(e.target.value)} />
          </div>
        </div>
        <div className="button-group">
          <button type="button" className="download-button" onClick={handleDownload}>Download JSON</button>
          <button type="button" className="submit-button" onClick={handleSubmit}>Submit</button>
        </div>
      </form>
      <div className="generated-json">
        <h3>Generated JSON:</h3>
        <ReactJson src={generateJSON()} theme="monokai" />
      </div>
    </div>
  );
};

export default AddAwsConfigurationForm;
