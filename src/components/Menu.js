import React, {useState} from 'react'
import { Link, useLocation } from 'react-router-dom';

const Menu = (props) => {
    const [expanded, setExpanded] = useState(false);
    const location = useLocation();

    // Method to exapand or collapse menu
    const toggleMenu = () => {
        setExpanded(!expanded);
    };

    const handleAddItem = (flag)=>{
      // Trigger modal based on flag (true-addModal, false-sellModal)
      if(flag){
         props.handleAddModal()
      }
      else {
        props.handleSellModal()
      }
    }

  return (
    <div className={`menu-container ${expanded ? 'expanded' : 'collapsed'}`}>
        <div className='menu-icon-container menu-btn shadow-sm my-2 ' onClick={toggleMenu}>
            <img className={`menu-icon ${expanded ? 'rotate-close' : 'rotate-menu'}`} src={expanded ? "../close_icon.png" : "../menu_icon.png"} alt="" />
        </div>

        {/* When menu bar is expanded it will show button as full length and with written text */}
      
        {expanded ? (
                <>
                    <MenuItem to="/" label="Inventory" location={location} />
                    <div className="menu-btn menu-btn-animate align-self-start " onClick={()=>{handleAddItem(true)}}>Add item</div>
                    <div className="menu-btn menu-btn-animate align-self-start " onClick={()=>{handleAddItem(false)}}>Sell item</div>
                    <MenuItem to="/history" label="History" location={location} />
                    <MenuItem to="/statement" label="Statement" location={location} />
                    <MenuItem to="/settings" label="Settings" location={location} />
                </>
            ) : (
              // When menu bar is collapsed it shows icons of buttons 
                <>
                    <MenuItem to="/" iconSrc="../home_icon.png" location={location} />
                    <div className="menu-btn menu-btn-animate menu-icon-container" onClick={()=>{handleAddItem(true)}}>
                      <img className='menu-icon' src="../add_icon.png" alt="" />
                    </div>
                    <div className="menu-btn menu-btn-animate menu-icon-container" onClick={()=>{handleAddItem(false)}}>
                      <img className='menu-icon' src="../minus_icon.png" alt="" />
                    </div>
                    <MenuItem to="/history" iconSrc="../history_icon.png" location={location} />
                    <MenuItem to="/statement" iconSrc="../statement_icon.png" location={location} />
                    <MenuItem to="/settings" iconSrc="../settings_icon.png" location={location} />
                </>
            )}
      
        
    </div>
  )
}

const MenuItem = ({ to, label, iconSrc, location }) => {
  const isActive = location.pathname === to;

  return (
    // Link which navigates to different components
      <Link to={to} className={`menu-btn menu-btn-animate ${label ? 'align-self-start': ''} ${iconSrc ? 'menu-icon-container' : ''} ${isActive ? 'selected' : ''}`}>
          {label && <span>{label}</span>}
          {iconSrc && <img className='menu-icon' src={iconSrc} alt="" />}
      </Link>
  );
};

export default Menu
