import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import ST from '../icons/Home.png'
import "../css/home.scss"
library.add(faCog);

const Sidebar = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
      <CDBSidebar toggled="true" textColor="#333" backgroundColor="#fff">
        <NavLink activeClassName="activeClicked">
          <CDBSidebarHeader className='textAlign' prefix={<img src={ST} alt="logo" style={{ background: "black", borderRadius: '50%', height:'4vw',width:'4vw'}} />} >
          </CDBSidebarHeader>
        </NavLink>
        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="upload">Upload</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/list" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="ring">Dashboard</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/list" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="bars">Records</CDBSidebarMenuItem>
            </NavLink>

          </CDBSidebarMenu>
        </CDBSidebarContent>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;