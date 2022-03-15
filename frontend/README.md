## Frontend things to do

- Create a single page minting website (use template/layout similar to [Dicklebutts](www.dicklebutts.com))
- Some assets (logo, font) can be found in the same folder as this readme
- Key features on the website:
    - Connect wallet button
    - Website should display whether presale is open or general sale (check [this script](https://github.com/sinhau/natureboy_nft/scripts/getPresaleStatus.js))
    - A mint button with a number to select how many NFTs to mint
        - For presale, can only mint one NFT
            - For presale mint, the website will need to generate a merkle proof client side (see [this script](https://github.com/sinhau/natureboy_nft/scripts/mintPresale.js)) so the contract can make sure only whitelisted addresses can mint NFT during presale
        - For general sale, can mint up to 3 NFTs at a time
    - Handle and display any revert error messages from the smart contract