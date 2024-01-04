import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import basket from '../image/shopping_basket.svg';
import logo from '../image/logo.svg';
import { message, Menu, Dropdown } from 'antd';
import { LogoutOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';

export default function Header() {
  const { authToken, onLogout, role } = useAuth();

  const handleLogout = () => {
    onLogout();
    message.success('Вы успешно вышли!');
  };

  const adminMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/AdminPanel">Admin Panel</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/UserOrders">User Orders</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/AddNews">Add News</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <header className='header'>
      <div className="logo">
        <p>Farmacie</p>
        <img src={logo} alt="" />
      </div>
      
      <nav className="nav">
        <ul>
          <li><Link className='link' to="/">News</Link></li>
          <li><Link className='link' to="/Products">Products</Link></li>

          {authToken ? (
            <>
              {role === 'admin' && (
                <li>
                  <Dropdown overlay={adminMenu}>
                    <Link to="#" className='link nav-account'>
                      <p>Dashboard</p> <DownOutlined />
                    </Link>
                  </Dropdown>
                </li>
              )}
              <li>
                <Link className='link nav-account' to="/Account">
                  <p>My Account</p> <UserOutlined />
                </Link>
              </li>
              <li>
                <div className='nav-account' onClick={handleLogout}>
                  <p>LogOut</p> <LogoutOutlined className='logout-img' />
                </div>
              </li>
            </>
          ) : (
            <li><Link className='link' to="/Login">Login</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
}
