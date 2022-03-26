## Frontend things to do

- Create a single page minting website (use template/layout similar to [Dicklebutts](https://dicklebutts.com))
- All the assets we have so far are in the ./public/assets folder
- Key features on the website:
    - Connect wallet button
    - Website should display whether presale is open or general sale (check [this example script](https://github.com/sinhau/natureboy_nft/blob/main/scripts/getPresaleStatus.js))
    - A mint button with a number to select how many NFTs to mint
        - For presale, can only mint one NFT
            - For presale mint, the website will need to generate a merkle proof client side (see [this example script](https://github.com/sinhau/natureboy_nft/blob/main/scripts/mintPresale.js)) so the contract can make sure only whitelisted addresses can mint NFT during presale
        - For general sale, can mint up to 3 NFTs at a time (check [this example script](https://github.com/sinhau/natureboy_nft/blob/main/scripts/mintRegular.js))
    - Handle and display any revert error messages from the smart contract (check [this smart contract](https://github.com/sinhau/natureboy_nft/blob/main/contracts/LoftyClouds.sol) to find all the required revert messages)