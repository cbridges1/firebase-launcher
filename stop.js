const port = process.env.SERVER_PORT ? process.env.SERVER_PORT : 1000;

const run = async () => {
    await fetch(
        `http://localhost:${port}/stop`,
        {
            method: 'POST',
        }
    )
    .then(async (response) => {
        const data = await response.json();
        console.log(data);
    })
}

run();