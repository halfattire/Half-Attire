"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { 
  MdOutlineSettings, 
  MdSecurity, 
  MdNotifications, 
  MdSave,
  MdRestoreFromTrash
} from "react-icons/md"
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa"
import { updateUserInfomation } from "@/redux/actions/user"

const AdminSettings = () => {
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state) => state.user)
  
  // Settings state - only using existing user fields and basic settings
  const [settings, setSettings] = useState({
    // Profile settings (based on existing user model)
    profile: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
    // Basic notification settings (local storage only)
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      systemNotifications: true,
    },
    // Basic appearance settings (local storage only)
    appearance: {
      theme: "light",
      language: "en",
    }
  })

  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('adminNotifications')
    const savedAppearance = localStorage.getItem('adminAppearance')
    
    if (savedNotifications) {
      try {
        const notifications = JSON.parse(savedNotifications)
        setSettings(prev => ({ ...prev, notifications }))
      } catch (error) {
        console.error('Error loading notification settings:', error)
      }
    }
    
    if (savedAppearance) {
      try {
        const appearance = JSON.parse(savedAppearance)
        setSettings(prev => ({ ...prev, appearance }))
      } catch (error) {
        console.error('Error loading appearance settings:', error)
      }
    }
  }, [])

  // Update user data when it changes
  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        profile: {
          name: user.name || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
        }
      }))
    }
  }, [user])

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Save profile changes to Redux/backend if changed
      if (settings.profile.name !== user?.name || settings.profile.phoneNumber !== user?.phoneNumber) {
        await dispatch(updateUserInfomation(settings.profile.name, settings.profile.phoneNumber))
      }
      
      // Save other settings to localStorage
      localStorage.setItem('adminNotifications', JSON.stringify(settings.notifications))
      localStorage.setItem('adminAppearance', JSON.stringify(settings.appearance))
      
      toast.success("Settings saved successfully!")
      setHasChanges(false)
    } catch (error) {
      toast.error("Failed to save settings")
      console.error('Settings save error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSettings = () => {
    if (window.confirm("Are you sure you want to reset all settings to default?")) {
      setSettings({
        profile: {
          name: user?.name || "",
          email: user?.email || "",
          phoneNumber: user?.phoneNumber || "",
        },
        notifications: {
          emailNotifications: true,
          orderNotifications: true,
          systemNotifications: true,
        },
        appearance: {
          theme: "light",
          language: "en",
        }
      })
      
      // Clear localStorage
      localStorage.removeItem('adminNotifications')
      localStorage.removeItem('adminAppearance')
      
      setHasChanges(false)
      toast.success("Settings reset to default")
    }
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "notifications", label: "Notifications", icon: MdNotifications },
    { id: "appearance", label: "Appearance", icon: MdOutlineSettings },
  ]

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={settings.profile.name}
            onChange={(e) => handleInputChange("profile", "name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={settings.profile.email}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            placeholder="Email cannot be changed"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be modified for security reasons</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={settings.profile.phoneNumber}
            onChange={(e) => handleInputChange("profile", "phoneNumber", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <input
            type="text"
            value={user?.role || "admin"}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Role is system-defined and cannot be changed</p>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
        <p className="text-sm text-gray-600">Choose which notifications you want to receive via email.</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Notifications
              </label>
              <p className="text-xs text-gray-500">General email notifications</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => handleInputChange("notifications", "emailNotifications", e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Order Notifications
              </label>
              <p className="text-xs text-gray-500">Notifications about new orders and order updates</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.orderNotifications}
              onChange={(e) => handleInputChange("notifications", "orderNotifications", e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                System Notifications
              </label>
              <p className="text-xs text-gray-500">Important system updates and maintenance notices</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.systemNotifications}
              onChange={(e) => handleInputChange("notifications", "systemNotifications", e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleInputChange("appearance", "theme", "light")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                settings.appearance.theme === "light"
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => handleInputChange("appearance", "theme", "dark")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                settings.appearance.theme === "dark"
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Dark
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Theme preference (saves to browser storage)</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={settings.appearance.language}
            onChange={(e) => handleInputChange("appearance", "language", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Interface language preference</p>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileSettings()
      case "notifications":
        return renderNotificationSettings()
      case "appearance":
        return renderAppearanceSettings()
      default:
        return renderProfileSettings()
    }
  }

  return (
    <div className="w-full p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your admin panel preferences</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button
            onClick={handleResetSettings}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm"
          >
            <MdRestoreFromTrash />
            Reset to Default
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={isLoading || !hasChanges || loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
          >
            <MdSave />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50/50">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-500 text-blue-600 bg-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="text-lg" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Save Notice */}
      {hasChanges && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <MdNotifications />
            <span className="text-sm">You have unsaved changes</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSettings
