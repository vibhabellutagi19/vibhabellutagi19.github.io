import React from "react";
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import "./socialLinks.css";


const SocialLinks = () => {
    const links = [
        { name: "GitHub", icon: <FaGithub />, url: "https://github.com/vibhabellutagi19" },
        { name: "Twitter", icon: <FaTwitter />, url: "https://x.com/buildwith_vibs" },
        { name: "LinkedIn", icon: <FaLinkedin />, url: "https://www.linkedin.com/in/vibhavari-bellutagi-837871189/" },
        { name: "Instagram", icon: <FaInstagram />, url: "https://www.instagram.com/buildwith_vibs/" },
    ];

    return (
        <div className="social-container">
            {links.map((link) => (
                <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                >
                    <span className={`social-icon ${link.name.toLowerCase()}`}>{link.icon}</span>
                    <span>{link.name}</span>
                </a>
            ))}
        </div>
    );
};

export default SocialLinks;