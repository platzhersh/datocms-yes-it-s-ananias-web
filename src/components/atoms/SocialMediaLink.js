import React from "react";


export default props => {
    const { url, linkText, icon } = props;
    return <a href={url} rel="noopener noreferrer" target="_blank">{icon} {linkText}</a>
};