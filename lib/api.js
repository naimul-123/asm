import axios from "axios";


export const postData = async (url, newData) => {
    const response = await axios.post(url, newData, {
        headers: {
            "Content-Type": "application/json",
        },
    })

    return response
}
export const putData = async (url, newData) => {
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)

    })
    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Network response was not ok:${errorData}`)
    }
    return response.json();
}
export const getData = async (url) => {
    const response = await axios.get(url)
    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Network response was not ok:${errorData}`)
    }
    const data = await response.json();
    return data;
}