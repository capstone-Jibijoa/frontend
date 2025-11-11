import React from 'react';
import styled from 'styled-components';

// Footer 컨테이너
const FooterContainer = styled.footer`
    width: 100%;
    padding-top: 40px;
    padding-bottom: 40px;
    margin-top: auto;
    margin-bottom: 0px; 
    z-index: 10;
    display: flex;
    justify-content: center;
`;

// Footer 안의 글자 스타일
const FooterText = styled.p`
    font-size: 15px;
    color: #ffffff;
    text-align: center;
    line-height: 1.6;
    margin: 0;
`;

const Footer = () => {
    return (
        <FooterContainer>
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