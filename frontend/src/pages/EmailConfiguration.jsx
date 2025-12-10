import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EmailConfiguration = () => {
    const [loading, setLoading] = useState(false);
    const [testing, setTesting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [logs, setLogs] = useState([]);

    const [formData, setFormData] = useState({
        service: 'custom',
        host: '',
        port: 587,
        secure: false,
        user: '',
        pass: ''
    });

    const providers = {
        gmail: { host: 'smtp.gmail.com', port: 587, secure: false },
        outlook: { host: 'smtp.office365.com', port: 587, secure: false },
        yahoo: { host: 'smtp.mail.yahoo.com', port: 465, secure: true },
        custom: { host: '', port: 587, secure: false }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/users/email-settings');
            if (response.data.data.emailSettings && response.data.data.emailSettings.isConfigured) {
                const settings = response.data.data.emailSettings;
                setFormData({
                    service: settings.service || 'custom',
                    host: settings.host,
                    port: settings.port,
                    secure: settings.secure,
                    user: settings.auth ? settings.auth.user : '',
                    pass: '' // Don't populate password
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const addLog = (text, type = 'info') => {
        setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text, type }]);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'service' && providers[value]) {
            const provider = providers[value];
            setFormData(prev => ({
                ...prev,
                service: value,
                host: provider.host,
                port: provider.port,
                secure: provider.secure
            }));
        }
    };

    const handleTest = async () => {
        // Validate inputs
        if (!formData.host || !formData.user) {
            setMessage({ type: 'error', text: 'Please fill in Host and Username.' });
            return;
        }

        setTesting(true);
        setLogs([]); // Clear logs
        addLog('Starting connection test...');
        addLog(`Connecting to ${formData.host}:${formData.port}...`);

        try {
            // Call the correct backend endpoint
            await api.post('/users/email-settings/verify', {
                service: formData.service,
                host: formData.host,
                port: Number(formData.port),
                secure: formData.secure,
                auth: {
                    user: formData.user,
                    pass: formData.pass // Send new pass if typed, or empty/undefined
                }
            });

            addLog('Connection verified successfully!', 'success');
            setMessage({ type: 'success', text: 'Connection verified! You can now save the settings.' });

        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            addLog(`Connection failed: ${errMsg}`, 'error');
            setMessage({ type: 'error', text: `Test failed: ${errMsg}` });
        }

        setTesting(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.put('/users/email-settings', {
                service: formData.service,
                host: formData.host,
                port: Number(formData.port),
                secure: formData.secure,
                auth: {
                    user: formData.user,
                    pass: formData.pass
                }
            });
            setMessage({ type: 'success', text: 'Email settings saved successfully!' });
            addLog('Settings saved successfully.', 'success');
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save settings' });
            addLog('Failed to save settings.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Settings Form */}
            <div className="md:col-span-2 space-y-6">
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    <div className="md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-1">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Email Configuration</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Configure your outgoing email settings.
                            </p>
                        </div>
                        <div className="mt-5 md:mt-0 md:col-span-2">
                            <form onSubmit={handleSave}>
                                <div className="grid grid-cols-6 gap-6">

                                    {/* Provider Selection */}
                                    <div className="col-span-6">
                                        <label htmlFor="service" className="block text-sm font-medium text-gray-700">Email Provider</label>
                                        <select
                                            id="service"
                                            name="service"
                                            value={formData.service}
                                            onChange={handleChange}
                                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        >
                                            <option value="gmail">Gmail</option>
                                            <option value="outlook">Outlook / Office 365</option>
                                            <option value="yahoo">Yahoo Mail</option>
                                            <option value="custom">Custom SMTP</option>
                                        </select>
                                    </div>

                                    <div className="col-span-6 sm:col-span-4">
                                        <label htmlFor="host" className="block text-sm font-medium text-gray-700">SMTP Host</label>
                                        <input
                                            type="text"
                                            name="host"
                                            id="host"
                                            value={formData.host}
                                            onChange={handleChange}
                                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div className="col-span-6 sm:col-span-2">
                                        <label htmlFor="port" className="block text-sm font-medium text-gray-700">Port</label>
                                        <input
                                            type="number"
                                            name="port"
                                            id="port"
                                            value={formData.port}
                                            onChange={handleChange}
                                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div className="col-span-6">
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="secure"
                                                    name="secure"
                                                    type="checkbox"
                                                    checked={formData.secure}
                                                    onChange={handleChange}
                                                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="secure" className="font-medium text-gray-700">Secure Connection (SSL/TLS)</label>
                                                <p className="text-gray-500">Usually true for port 465, false for 587.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-6">
                                        <label htmlFor="user" className="block text-sm font-medium text-gray-700">Email Address (Username)</label>
                                        <input
                                            type="email"
                                            name="user"
                                            id="user"
                                            value={formData.user}
                                            onChange={handleChange}
                                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>

                                    <div className="col-span-6">
                                        <label htmlFor="pass" className="block text-sm font-medium text-gray-700">Password / App Password</label>
                                        <input
                                            type="password"
                                            name="pass"
                                            id="pass"
                                            placeholder={formData.pass ? "••••••••" : "Enter new password"}
                                            value={formData.pass}
                                            onChange={handleChange}
                                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                        <p className="mt-2 text-sm text-red-600">
                                            ⚠ Do NOT use your regular login password. Use an <strong>App Password</strong>.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={handleTest}
                                        disabled={testing || loading}
                                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    >
                                        {testing ? 'Testing...' : 'Test Connection'}
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    >
                                        {loading ? 'Saving...' : 'Save Settings'}
                                    </button>
                                </div>
                            </form>

                            {/* Message Alert */}
                            {message.text && (
                                <div className={`mt-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {message.text}
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Log Console */}
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-green-400 h-48 overflow-y-auto">
                    <div className="text-gray-500 border-b border-gray-700 pb-2 mb-2">Connection Logs</div>
                    {logs.length === 0 && <div className="text-gray-600 italic">No logs yet...</div>}
                    {logs.map((log, i) => (
                        <div key={i} className={`${log.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                            <span className="text-gray-500">[{log.time}]</span> {log.text}
                        </div>
                    ))}
                </div>
            </div>

            {/* Guide Panel */}
            <div className="md:col-span-1">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 sticky top-6">
                    <h4 className="text-lg font-bold text-blue-900 mb-4">Configuration Guide</h4>

                    <div className="space-y-4 text-sm text-blue-800">
                        <p>
                            To send emails from your own account, you need to configure SMTP settings.
                        </p>

                        <div className="bg-white p-3 rounded border border-blue-100">
                            <h5 className="font-bold text-blue-900">Gmail Settings</h5>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                                <li>Host: smtp.gmail.com</li>
                                <li>Port: 587</li>
                                <li>Secure: Unchecked (TLS)</li>
                            </ul>
                        </div>

                        <div className="bg-white p-3 rounded border border-blue-100">
                            <h5 className="font-bold text-blue-900 border-b border-blue-100 pb-1 mb-2">⚠ App Passwords</h5>
                            <p className="mb-2">
                                <strong>Most Important:</strong> If you use 2-Factor Authentication (2FA), your regular password will NOT work.
                            </p>
                            <p>
                                You typically need to generate an <strong>App Password</strong> in your email provider's security settings.
                            </p>
                        </div>

                        <div>
                            <h5 className="font-bold text-blue-900 mb-2">Video Tutorial</h5>
                            <a
                                href="https://www.youtube.com/watch?v=J4CtP1MBtOE"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-red-600 text-white text-center py-2 rounded hover:bg-red-700 transition"
                            >
                                Watch: How to get App Password
                            </a>
                            <p className="text-xs text-center mt-1 text-blue-600">
                                (Link opens in new tab)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailConfiguration;
