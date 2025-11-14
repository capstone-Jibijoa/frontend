import React from 'react';
import styled from 'styled-components';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import { PageWrapper, Headline } from '../style/MainPage.styles';


const MainPage = () => {
    return (
        <PageWrapper>
            <Headline>
                Creative Way
                <br />
                For Insight
            </Headline>
            <SearchBar marginTop="95px" />
            <Footer />
        </PageWrapper>
    );
};

export default MainPage;