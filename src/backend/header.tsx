import React from 'react';

const Header = () => {
  return (
    <div className="mt-2 flex justify-center">
      <div className="w-[800px]">
        <a className="text-blue-500 underline" href="/status" hx-boost="true">Status</a>
      </div>
      
      <script type="module" src="/public/wagmi/login.component.js" />
      <wagmi-login></wagmi-login>
    </div>
  )
}

export default Header
