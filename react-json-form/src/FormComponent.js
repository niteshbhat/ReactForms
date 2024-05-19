import React, { useState } from 'react';
import './FormComponent.css';

const FormComponent = () => {
  const [action, setAction] = useState('');
  const [serviceCiId, setServiceCiId] = useState('');
  const [serviceDisplay, setServiceDisplay] = useState('');
  const [serviceStaff, setServiceStaff] = useState('');
  const [accountType, setAccountType] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountDescription, setAccountDescription] = useState('');
  const [safeName, setSafeName] = useState('');
  const [awsSecretKey, setAwsSecretKey] = useState('');

  const handleActionChange = (e) => setAction(e.target.value);
  const handleServiceCiIdChange = (e) => setServiceCiId(e.target.value);
  const handleServiceDisplayChange = (e) => setServiceDisplay(e.target.value);
  const handleServiceStaffChange = (e) => setServiceStaff(e.target.value);
  const handleAccountTypeChange = (e) => setAccountType(e.target.value);
  const handleAccountNameChange = (e) => setAccountName(e.target.value);
  const handleAccountDescriptionChange = (e) => setAccountDescription(e.target.value);
  const handleSafeNameChange = (e) => setSafeName(e.target.value);
  const handleAwsSecretKeyChange = (e) => setAwsSecretKey(e.target.value);

  const generateJSON = () => {
    const json = {
      action,
      serviceCiId,
      serviceDisplay,
      serviceStaff,
      accountType,
      accountName,
      accountDescription
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
    link.download = 'data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="form-container">
      <form>
        <div className="form-group">
          <label>Action:</label>
          <select value={action} onChange={handleActionChange}>
            <option value="" disabled>Select an option</option>
            <option value="AddTheAcount">Add The Account</option>
            <option value="DeleteTheAccount">Delete The Account</option>
            <option value="ModifiedTheAccount">Modified The Account</option>
          </select>
        </div>
        <div className="form-group">
          <label>Service CI ID:</label>
          <input type="text" value={serviceCiId} onChange={handleServiceCiIdChange} />
        </div>
        <div className="form-group">
          <label>Service Display:</label>
          <input type="text" value={serviceDisplay} onChange={handleServiceDisplayChange} />
        </div>
        <div className="form-group">
          <label>Service Staff:</label>
          <input type="text" value={serviceStaff} onChange={handleServiceStaffChange} />
        </div>
        <div className="form-group">
          <label>Account Type:</label>
          <select value={accountType} onChange={handleAccountTypeChange}>
            <option value="" disabled>Select an option</option>
            <option value="CDX">CDX</option>
            <option value="AWS">AWS</option>
          </select>
        </div>
        {accountType && (
          <>
            <div className="form-group">
              <label>Account Name:</label>
              <input type="text" value={accountName} onChange={handleAccountNameChange} />
            </div>
            <div className="form-group">
              <label>Account Description:</label>
              <input type="text" value={accountDescription} onChange={handleAccountDescriptionChange} />
            </div>
          </>
        )}
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
        <pre>{JSON.stringify(generateJSON(), null, 2)}</pre>
        <button onClick={handleDownload}>Download JSON</button>
      </div>
    </div>
  );
};

export default FormComponent;
