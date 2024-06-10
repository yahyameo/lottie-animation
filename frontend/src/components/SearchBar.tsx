import React, { useEffect, useState } from 'react';
import './SearchBar.css';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_ANIMATIONS } from '../utils/graphql-commands';
import { AnimationItemProps } from './AnimationItem';


interface SearchBarProps {
    onSearch: (animations: AnimationItemProps[]) => void;
    isOnline: boolean,
    animations: AnimationItemProps[];
}
const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isOnline, animations }) => {
    const [query, setQuery] = useState('');
    const [searchAnimations, { loading, data }] = useLazyQuery(SEARCH_ANIMATIONS);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let _query = e.target.value;
        setQuery(_query);
        if (isOnline) searchAnimations({ variables: { query: _query } });
        else {
            const filteredAnimations = animations.filter(animation =>
                animation.name.toLowerCase().includes(_query.toLowerCase())
            );
            onSearch(filteredAnimations);
        }
    };
    useEffect(() => {
        if (data && data.searchAnimations) onSearch(data.searchAnimations);
    }, [data && data.searchAnimations])

    return (
        <div className="search-bar">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search..."
                className="search-input"
            />
            <button className="search-button">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="search-icon"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3.5a7.5 7.5 0 006.15 13.15z"
                    />
                </svg>
            </button>
        </div>
    );
};

export default SearchBar;
