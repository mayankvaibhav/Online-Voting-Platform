import React from 'react';
import styles from './adminList.module.css';

const admins = [
  { name: 'Harshit Raj', email: 'harshitraj0702@gmail.com', contact: '9308561500' },
  { name: 'Suraj Mani', email: 'roy003727@gmail.com', contact: '9971153192' },
  { name: 'Dharmendra Singh', email: '@gmail.com', contact: '9142433802' }
];

const AdminList = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Online Voting Platform</h1>
        <a className={styles.nav} href="/home">Home</a>
      </header>
      
      <div className={styles.adminList}>
        {admins.map((admin, index) => (
          <div key={index} className={styles.adminCard}>
            <div className={styles.profile}></div>
            <h2 className={styles.name}>{admin.name}</h2>
            <p className={styles.contact}>Email: <a href={`mailto:${admin.email}`}>{admin.email}</a></p>
            <p className={styles.contact}>Contact: {admin.contact}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminList;