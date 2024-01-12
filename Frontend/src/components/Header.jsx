import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../image/logo.svg';
import { message, Menu, Dropdown } from 'antd';
import { LogoutOutlined, DownOutlined } from '@ant-design/icons';

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
        <Link to="/AdminPanelOrders">User Orders</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/AddNews">Add News</Link>
      </Menu.Item>
    </Menu>
  );

  const userMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/ShoppingCart">Shoping Cart</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/Orders">Orders</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/Feedback">Feedback</Link>
      </Menu.Item>
      <Menu.Item key="4">
        <Link to="/AccountDetails">AccountDetails</Link>
      </Menu.Item>
    </Menu>
  )

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
                  <Dropdown overlay={adminMenu} trigger={['click']}>
                    <Link to="#" className='link nav-account'>
                      <p>Dashboard</p> <DownOutlined />
                    </Link>
                  </Dropdown>
                </li>
              )}
              <li>
              <Dropdown overlay={userMenu} trigger={['click']}>
                    <Link to="#" className='link nav-account'>
                      <p>Info</p> <DownOutlined />
                    </Link>
                  </Dropdown>
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
