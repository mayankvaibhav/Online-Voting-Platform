import React from 'react';
import adstyles from './adminList.module.css'; // Adjust the path to your CSS module

const AdminList = () => {
  return (
    <div className={adstyles.adminListBody}>
      <div className={adstyles.header}>
        <a className={adstyles.nav} href="#">HOME</a>
      </div>
      <div className={adstyles.banner}></div>
      <div className={adstyles.adminDetailsContainer}>
        <div className={adstyles.adminDetailsWrapper}>
          <div className={adstyles.nothing}></div>
          <div className={adstyles.adminDetails}>
            <div className={adstyles.profileName}>
              <div className={adstyles.profile}></div>
              <div className={adstyles.name}>
                <span>Harshit Raj</span>
              </div>
            </div>
            <div className={adstyles.contactDetailsContainer}>
              <div>Contact Details</div>
              <div>Email: <a href="mailto:harshitraj0702@gmail.com">harshitraj0702@gmail.com</a></div>
              <div>Contact No: 9308561500</div>
            </div>
          </div>
          <div className={adstyles.nothing}></div>
        </div>

        <div className={adstyles.adminDetailsWrapper}>
          <div className={adstyles.nothing}></div>
          <div className={adstyles.adminDetails}>
            <div className={adstyles.profileName}>
              <div className={adstyles.profile}></div>
              <div className={adstyles.name}>
                <span>Suraj Mani</span>
              </div>
            </div>
            <div className={adstyles.contactDetailsContainer}>
              <div>Contact Details</div>
              <div>Email: <a href="mailto:roy003727@gmail.com">roy003727@gmail.com</a></div>
              <div>Contact No: 9971153192</div>
            </div>
          </div>
          <div className={adstyles.nothing}></div>
        </div>

        <div className={adstyles.adminDetailsWrapper}>
          <div className={adstyles.nothing}></div>
          <div className={adstyles.adminDetails}>
            <div className={adstyles.profileName}>
              <div className={adstyles.profile}></div>
              <div className={adstyles.name}>
                <span>Dharmendra Singh</span>
              </div>
            </div>
            <div className={adstyles.contactDetailsContainer}>
              <div>Contact Details</div>
              <div>Email: <a href="mailto:@gmail.com">@gmail.com</a></div>
              <div>Contact No: 9142433802</div>
            </div>
          </div>
          <div className={adstyles.nothing}></div>
        </div>
      </div>
    </div>
  );
};

export default AdminList;
