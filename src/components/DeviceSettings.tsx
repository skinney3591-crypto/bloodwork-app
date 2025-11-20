import { Watch, Wifi, Battery, RefreshCw, Settings, CheckCircle, AlertCircle, Clock, Shield, HelpCircle } from 'lucide-react'
import DeviceIcon from './DeviceIcon'
import DeviceBadge from './DeviceBadge'

// Device status type
type DeviceStatus = 'connected' | 'disconnected' | 'syncing' | 'error'

interface Device {
  id: string
  name: string
  type: 'fitbit' | 'apple_health' | 'oura'
  status: DeviceStatus
  lastSync: string
  battery: number | null
  dataPermissions: string[]
  syncFrequency: 'realtime' | 'hourly' | 'daily'
}

const mockDevices: Device[] = [
  {
    id: '1',
    name: 'Fitbit Charge 6',
    type: 'fitbit',
    status: 'connected',
    lastSync: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    battery: 78,
    dataPermissions: ['Steps', 'Heart Rate', 'Sleep', 'Active Minutes', 'Calories'],
    syncFrequency: 'hourly'
  },
  {
    id: '2',
    name: 'Apple Watch Series 9',
    type: 'apple_health',
    status: 'connected',
    lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
    battery: 92,
    dataPermissions: ['Workouts', 'Heart Rate', 'Steps', 'Sleep'],
    syncFrequency: 'realtime'
  },
  {
    id: '3',
    name: 'Oura Ring Gen 3',
    type: 'oura',
    status: 'connected',
    lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    battery: 45,
    dataPermissions: ['Sleep Stages', 'Heart Rate Variability', 'Body Temperature', 'Readiness Score'],
    syncFrequency: 'daily'
  }
]

export default function DeviceSettings() {
  const getStatusColor = (status: DeviceStatus) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-100'
      case 'disconnected':
        return 'text-gray-600 bg-gray-100'
      case 'syncing':
        return 'text-blue-600 bg-blue-100'
      case 'error':
        return 'text-red-600 bg-red-100'
    }
  }

  const getStatusIcon = (status: DeviceStatus) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5" />
      case 'disconnected':
        return <AlertCircle className="h-5 w-5" />
      case 'syncing':
        return <RefreshCw className="h-5 w-5 animate-spin" />
      case 'error':
        return <AlertCircle className="h-5 w-5" />
    }
  }

  const getBatteryColor = (level: number | null) => {
    if (level === null) return 'text-gray-400'
    if (level > 50) return 'text-green-600'
    if (level > 20) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTimeSince = (isoString: string) => {
    const now = new Date()
    const then = new Date(isoString)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-3 rounded-xl">
              <Watch className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Device Settings</h1>
              <p className="text-gray-600">Manage your connected health devices</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
            <Wifi className="h-5 w-5" />
            <span>Add New Device</span>
          </button>
        </div>

        {/* Sync Summary */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 text-green-700 mb-1">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">Connected</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{mockDevices.filter(d => d.status === 'connected').length}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2 text-blue-700 mb-1">
              <RefreshCw className="h-5 w-5" />
              <span className="font-semibold">Last Synced</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">5 mins ago</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-2 text-purple-700 mb-1">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">Data Types</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">
              {new Set(mockDevices.flatMap(d => d.dataPermissions)).size}
            </p>
          </div>
        </div>
      </div>

      {/* Connected Devices */}
      <div className="space-y-4">
        {mockDevices.map(device => (
          <div key={device.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  <DeviceIcon type={device.type} className="h-8 w-8" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{device.name}</h3>
                    <DeviceBadge type={device.type} />
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full font-medium ${getStatusColor(device.status)}`}>
                      {getStatusIcon(device.status)}
                      <span className="capitalize">{device.status}</span>
                    </div>
                    {device.battery !== null && (
                      <div className={`flex items-center space-x-2 ${getBatteryColor(device.battery)}`}>
                        <Battery className="h-4 w-4" />
                        <span className="font-medium">{device.battery}%</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Synced {getTimeSince(device.lastSync)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Device settings">
                  <Settings className="h-5 w-5" />
                </button>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Sync Now</span>
                </button>
              </div>
            </div>

            {/* Device Details Grid */}
            <div className="grid grid-cols-2 gap-6 mt-6">
              {/* Data Permissions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Shield className="h-5 w-5 text-gray-700" />
                  <h4 className="font-semibold text-gray-900">Data Access</h4>
                </div>
                <div className="space-y-2">
                  {device.dataPermissions.map(permission => (
                    <div key={permission} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sync Settings */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <RefreshCw className="h-5 w-5 text-gray-700" />
                  <h4 className="font-semibold text-gray-900">Sync Settings</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sync Frequency
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      value={device.syncFrequency}
                    >
                      <option value="realtime">Real-time</option>
                      <option value="hourly">Every Hour</option>
                      <option value="daily">Once Daily</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Wifi className="h-4 w-4" />
                    <span>Auto-sync over Wi-Fi only</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center space-x-2">
                <HelpCircle className="h-4 w-4" />
                <span>Troubleshooting</span>
              </button>
              <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                Disconnect Device
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <HelpCircle className="h-6 w-6 text-blue-700" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-700 mb-4">
              Having trouble connecting your device? Check out our troubleshooting guides or contact support.
            </p>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                View Guides
              </button>
              <button className="px-4 py-2 bg-white text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-gray-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">Your Privacy Matters</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              We take your privacy seriously. Your health data is encrypted and securely stored.
              We only sync the data types you've explicitly granted permission for. You can revoke
              access or disconnect devices at any time. Learn more about our{' '}
              <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
                privacy policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
