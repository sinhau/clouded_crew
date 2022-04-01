import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

import addreses from './whitelist.json';

export async function handler({event, setVal}) {
    const hashedAddresses = addreses.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(hashedAddresses, keccak256, { sortPairs: true });
    
    const hashedAddress = keccak256(event);
    const proof = merkleTree.getHexProof(hashedAddress);
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(proof)
    }
    if(proof.length > 0){
    setVal(proof);
    }else{
        setVal(null);
    }
}