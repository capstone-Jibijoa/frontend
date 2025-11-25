import React, {useState} from 'react';
import styled from 'styled-components';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import { PageWrapper, Headline } from '../style/MainPage.styles';
import RecommendationChips from '../components/RecommendationChips';


const MainPage = () => {
    const [currentModel, setCurrentModel] = useState('lite');

    return (
        <PageWrapper>
            <Headline>
                Creative Way
                <br />
                For Insight
            </Headline>
            <SearchBar 
                marginTop="95px"
                defaultModel={currentModel}
                onModelChange={setCurrentModel} 
            />
            <RecommendationChips currentModel={currentModel} />
            <Footer />
        </PageWrapper>
    );
};

export default MainPage;