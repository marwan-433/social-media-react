
import logo from "../../assets/route.png"
import { Tabs, Button, Dropdown, Label } from '@heroui/react'
import { House, MessageCircle, Settings, User } from 'lucide-react'
import { useContext } from "react"
import { TokenContext } from "../Context/tokenContext"
import { Link } from "react-router"
import { UserContext, type UserContextType } from "../Context/UserContext"


function Navbar() {
  const {settoken} = useContext(TokenContext)
  const {userDetails} : UserContextType = useContext(UserContext)
  function logout() {
    localStorage.removeItem("userToken");
    settoken(null);
  }
  return (
    <>
      <nav className='bg-gray-200 py-2'>
        <div className='mx-8 flex justify-between items-center'>
           <div className='nav-logo flex gap-2 items-center'>
            <img src={logo} className='w-9 rounded-xl' alt="logo" />
            <h1 className='text-lg font-bold'>Route Posts</h1>
           </div>

           <div className='nav-links'>
            <Tabs className="w-full max-w-md">
      <Tabs.ListContainer>
        <Tabs.List aria-label="Options">
          <Tabs.Tab id="feed" className='flex gap-2'>
            <House />
            <Link to="/home">Feed</Link>
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="profile" className='flex gap-2'>
            <User />
            <Link to = "/profile">Profile</Link>
            
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="notifications" className='flex gap-2'>
            <MessageCircle />
            <Link to="/notification">Notifications</Link>
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
      <Tabs.Panel className="pt-4" id="overview">
        <p>View your project overview and recent activity.</p>
      </Tabs.Panel>
      <Tabs.Panel className="pt-4" id="analytics">
        <p>Track your metrics and analyze performance data.</p>
      </Tabs.Panel>
      <Tabs.Panel className="pt-4" id="reports">
        <p>Generate and download detailed reports.</p>
      </Tabs.Panel>
    </Tabs>
           </div>
           <div className='nav-actions'>
            <Dropdown>
      <Button aria-label="Menu" variant="primary">
        <div className="w-8 h-8">
          <img src={userDetails?.photo} className="w-full rounded-full" alt="" />
        </div>
        {userDetails?.name}
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
          <Dropdown.Item id="profile" textValue="profile">
            <User />
            <Label>Profile</Label>
          </Dropdown.Item>
          <Dropdown.Item id="settings" textValue="settings">
            <Settings />
            <Label>Settings</Label>
          </Dropdown.Item>
          <Dropdown.Item id="logout" textValue="logout" variant="danger" onClick={logout}>
            <Label >Logout</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
           </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
