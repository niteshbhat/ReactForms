import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import './FormComponent.css';

const OnboardingForm = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [accountType, setAccountType] = useState('');
  const [safeName, setSafeName] = useState('');
  const [awsSecretKey, setAwsSecretKey] = useState('');
  const [equipment, setEquipment] = useState('');
  const [accessLevel, setAccessLevel] = useState('');

  const handleEmployeeNameChange = (e) => setEmployeeName(e.target.value);
  const handleEmployeeIdChange = (e) => setEmployeeId(e.target.value);
  const handleDepartmentChange = (e) => setDepartment(e.target.value);
  const handleRoleChange = (e) => setRole(e.target.value);
  const handleAccountTypeChange = (e) => setAccountType(e.target.value);
  const handleSafeNameChange = (e) => setSafeName(e.target.value);
  const handleAwsSecretKeyChange = (e) => setAwsSecretKey(e.target.value);
  const handleEquipmentChange = (e) => setEquipment(e.target.value);
  const handleAccessLevelChange = (e) => setAccessLevel(e.target.value);

  const generateJSON = () => {
    const json = {
      employeeName,
      employeeId,
      department,
      role,
      accountType,
      equipment,
      accessLevel
    };

    if (accountType === 'CDX') {
      json.safeName = safeName;
    } else if (accountType === 'AWS') {
      json.awsSecretKey = awsSecretKey;
    }

    return json;
  };

  const handleDownload = () => {
    const json = generateJSON();
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'onboarding_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async () => {
    const json = generateJSON();
    const response = await fetch('https://your-api-endpoint.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    });

    if (response.ok) {
      alert('Data submitted successfully!');
    } else {
      alert('Error submitting data');
    }
  };

  return (
    <div className="form-container">
      <form>
        <div className="form-row">
          <div className="form-group">
            <label>Employee Name:</label>
            <input type="text" value={employeeName} onChange={handleEmployeeNameChange} />
          </div>
          <div className="form-group">
            <label>Employee ID:</label>
            <input type="text" value={employeeId} onChange={handleEmployeeIdChange} />
          </div>
          <div className="form-group">
            <label>Department:</label>
            <input type="text" value={department} onChange={handleDepartmentChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Role:</label>
            <input type="text" value={role} onChange={handleRoleChange} />
          </div>
          <div className="form-group">
            <label>Account Type:</label>
            <select value={accountType} onChange={handleAccountTypeChange}>
              <option value="" disabled>Select an option</option>
              <option value="CDX">CDX</option>
              <option value="AWS">AWS</option>
            </select>
          </div>
          <div className="form-group">
            <label>Equipment Needed:</label>
            <input type="text" value={equipment} onChange={handleEquipmentChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Access Level:</label>
            <input type="text" value={accessLevel} onChange={handleAccessLevelChange} />
          </div>
        </div>
        {accountType === 'CDX' && (
          <div className="form-group">
            <label>Safe Name:</label>
            <input type="text" value={safeName} onChange={handleSafeNameChange} />
          </div>
        )}
        {accountType === 'AWS' && (
          <div className="form-group">
            <label>AWS Secret Key:</label>
            <input type="text" value={awsSecretKey} onChange={handleAwsSecretKeyChange} />
          </div>
        )}
      </form>
      <div className="generated-json">
        <h3>Generated JSON:</h3>
        <ReactJson src={generateJSON()} theme="monokai" />
        <div className="button-group">
          <button className="download-button" onClick={handleDownload}>Download JSON</button>
          <button className="submit-button" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;