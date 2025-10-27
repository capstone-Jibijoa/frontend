import React from 'react';
import styled from 'styled-components';

// FooterContainer의 스타일은 그대로 유지합니다.
const FooterContainer = styled.footer`
    width: 100%; /* 너비는 100%로 유지 */
    
    padding-top: 40px;
    padding-top: 40px;
    
    margin-top: auto; 
    z-index: 10;
    display: center;
    justify-content: center;
`;

// FooterText의 스타일은 그대로 유지합니다.
const FooterText = styled.p`
    font-size: 18px;
    color: #ffffff;
    text-align: center;
    line-height: 1.6;
    margin: 0;
`;

const Footer = () => {
    return (
        <FooterContainer>
        {/* 이 부분의 텍스트만 추천 문구로 변경합니다. */}
        <FooterText>
            © 2025 JIBIJOA. All rights reserved.
            <br />
            This project is a Software Capstone Design by Hansung University.
            <br />
            The content on this site is intended for demonstration purposes only.
        </FooterText>
        </FooterContainer>
    );
};

export default Footer;