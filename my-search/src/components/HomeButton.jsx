import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledLink = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 56px;
    padding: 0 0px;
    background-color: transparent;
    color: #D466C9;
    text-decoration: none;
    font-weight: 600;
    font-size: 2rem;
    letter-spacing: 1.7px;
    transition: background-color 0.2s ease;
    white-space: nowrap;
    cursor: pointer;

    &:hover {
        color: #b044a5;
        transform: scale(1.05);
    }
`;

const HomeButton = () => {
    return (
        <StyledLink to="/">
        Jibijoa
        </StyledLink>
    );
};

export default HomeButton;