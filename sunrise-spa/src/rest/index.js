import config from '../../sunrise.config';
import fetch from '../apollo/auth';


export const get = async (endpoint) => {
    const response = await fetch(`${config.gr4vy.host}${endpoint}`,
    {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    const result = await response.json();
    return result;
}

export const post = async (endpoint, data) => {
    const response = await fetch(`${config.gr4vy.host}${endpoint}`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    const result = await response.json();
    return result;
}
