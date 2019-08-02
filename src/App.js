import React, { useState } from "react";
import Namicorn from "namicorn";
import "./App.css";

const NO_ADDRESS_FOUND = "No Address found for selected coin";
const NOT_REGISTERED = "Domain is not registered";
const INVALID_DOMAIN = "Invalid Domain";

const App = () => {
    const namicorn = new Namicorn();
    const [userInput, setUserInput] = useState("");
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [domainInfo, setDomainInfo] = useState(null);

    const _renderSpinner = () => (
        <div className="lds-roller">
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
        </div>
    );

    const handleUserInput = e => {
        const tempUserInput = e.target.value;
        if (tempUserInput === "") {
            setDomainInfo(null);
            if (loadingSpinner) setLoadingSpinner(false);
        }
        setUserInput(tempUserInput);
    };

    const handleSubmit = e => {
        e.preventDefault();
        const potentialDomain = userInput.split(".");
        if (
            potentialDomain.length > 1 &&
            potentialDomain[potentialDomain.length - 1].length > 0
        ) {
            setLoadingSpinner(true);
            setDomainInfo(null);
            if (window !== "undefined") {
                namicorn
                    .resolve(userInput)
                    .then(domainInfo => {
                        setDomainInfo(domainInfo);
                        setLoadingSpinner(false);
                    })
                    .catch(e => console.error(e));
            }
        } else setDomainInfo({ invalid: true });
    };

    const renderSearchBar = () => (
        <div className="Wrapper">
            <div className="Input">
                <form onSubmit={handleSubmit} className="FormInput">
                    <input
                        type="text"
                        id="input"
                        className="Input-text"
                        placeholder="Please enter domain you wish to inspect"
                        value={userInput}
                        onChange={handleUserInput}
                    />
                    <button onSubmit={handleSubmit} className="Submit-button">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );

    const _renderAddresses = addresess => {
        const result = [];
        for (let coin in addresess) {
            if (addresess.hasOwnProperty(coin))
                result.push(
                    <div className="resultAddressesRow" key={addresess[coin]}>
                        <span
                            key={addresess[coin]}
                            className="Title"
                            style={{ fontWeight: "bold" }}
                        >
                            {coin} :{" "}
                        </span>
                        <span
                            key={coin}
                            style={{ fontStyle: "italic" }}
                            className="Title"
                        >
                            {addresess[coin]}
                        </span>
                    </div>
                );
        }
        return <div className="resultAddresses">{result}</div>;
    };

    const renderResults = () => (
        <>
            {loadingSpinner ? _renderSpinner() : null}
            {!domainInfo ? (
                ""
            ) : domainInfo.invalid ? (
                <span className="Title"> {INVALID_DOMAIN} </span>
            ) : domainInfo.meta.owner === null ? (
                <span className="Title"> {NOT_REGISTERED}</span>
            ) : (
                _renderAddresses(domainInfo.addresses) || NO_ADDRESS_FOUND
            )}
        </>
    );

    return (
        <div className="App">
            <div className="header">
                <h1 className="Title">Domain Name Resolution example</h1>
            </div>
            <div className="searchBar">{renderSearchBar()}</div>
            <div className="results">{renderResults()}</div>
        </div>
    );
};

export default App;
