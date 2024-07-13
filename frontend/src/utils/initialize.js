async function connectMetamask() {
    try {
        //check metamask is installed
        if (window.ethereum) {
    
            //request user to connect accounts (Metamask will prompt)
            const result = await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("result ", result)
    
            //show the first connected account in the react page
            return {message: true, result};
        } else {
            return {message: false, result: "Please download metamask"}
        }
    } catch(err) {
        console.log("error while initializing provider",err);
        return {message: false, result: err.message};
    }
};



module.exports = { connectMetamask }