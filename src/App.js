import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import GlobalFonts from './assets/fonts/fonts';


export const StyledNumberInput = styled.input.attrs((props) => ({
  type: 'number',
  min: 1,
  max: 10,
  defaultValue: props.value,
}))`
border-radius: 50px;
border: none;
background-color: #999000;
padding: 5px;
font-weight: bold;
color: #000000;
width: 50px;
cursor: ;
box-shadow: 2px 8px 4px -2px rgba(250, 250, 0, 0.5);
-webkit-box-shadow: 2px 3px 10px -2px rgba(0, 0, 0, 0.5);
-moz-box-shadow: 2px 8px 4px -2px rgba(250, 250, 0, 0.5);
:active {
  box-shadow: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
}
`;


export const StyledButton = styled.button`
  font-family: 'shlop-regular';
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #000000;
  padding: 10px;
  font-weight: bold;
  color: #bada55;
  width: 300px;
  cursor: pointer;
  box-shadow: 2px 8px 4px -2px rgba(250, 250, 0, 0.5);
  -webkit-box-shadow: 2px 3px 10px -2px rgba(250, 250, 0, 1.0);
  -moz-box-shadow: 2px 8px 4px -2px rgba(250, 250, 0, 0.5);
  :active {
    box-shadow: none;
    -webkit-box-shadow: 2px 3px 10px -2px rgba(250, 250, 0, 1.0);
    -moz-box-shadow: none;
  }
  :hover {
    -webkit-box-shadow: 2px 3px 20px -2px rgba(100, 0, 250, 0.9);
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  font-family: 'shlop-regular';
  font-color: #BADA55;
  flex: ;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: column;
  }
`;


function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState(" 1 Pumpkinz NFT = .06 ETH");
  const [claimingNft, setClaimingNft] = useState(false);
  const [mintQuantity, setMintQuantity] = useState(1)

  const claimNFTs = (_amount) => {
    if (_amount <= 0) {
      return;
    }
    setFeedback("Preparing your Pumpkin NFT...");
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(_amount)
      .send({
        to: "0x1ac8c9bacfb419ad196cfc3983c84ce89bbf3464",
        from: blockchain.account,
        value: blockchain.web3.utils.toWei((.06 * _amount).toString(), "ether"),
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("It seems the transaction was cancelled | 1 Pumpkin = .06 ETH");
        setClaimingNft(false);
      })
      .then((receipt) => {
        setFeedback(
          "Happy Halloween!"
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen style={{ backgroundColor: ": var(--backgroundcol)" }}>
      
      <s.Container flex={1} ai={"center"} style={{ padding: 20 }}>
        <GlobalFonts />
          <ResponsiveWrapper flex={10} style={{ padding: 0 }}>
            
            <s.Container flex={1} jc={"center"} ai={"center"}>
              <s.TextTitle
                style={{ textAlign: "center", fontSize: 26, fontWeight: "bold" }}

              >
                {data.totalSupply}/666
                <s.SpacerSmall />
              </s.TextTitle>
            </s.Container>
            <s.Container
              flex={10}
              jc={"center"}
              ai={"center"}
              style={{ backgroundColor: "#1d1f3d", padding: 2 }}
            >
              {Number(data.totalSupply) >= 666 ? (
                <>
                  <s.TextTitle style={{ textAlign: "center" }}>
                    SOLD OUT!
                  </s.TextTitle>
                  <s.SpacerMedium />
                  <s.TextDescription style={{ textAlign: "center" }}>
                    You can still trade Pumpkinz at {" "}
                    <a
                      target={""}
                      href={"https://opensea.io/"}
                    >
                      The Bee Collaborative
                    </a>
                  </s.TextDescription>
                </>
              ) : (
                <>
                  <s.TextDescription style={{ textAlign: "center" }}>
                    {feedback}
                  </s.TextDescription>
                  <s.SpacerSmall />
                  {blockchain.account === "" ||
                    blockchain.smartContract === null ? (
                    <s.Container ai={"center"} jc={"center"}>
                      <s.SpacerSmall />
                      <StyledButton
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                        } }
                        style={{}}
                      >
                        CONNECT WALLET
                      </StyledButton>
                      {blockchain.errorMsg !== "" ? (
                        <>
                          <s.TextDescription style={{ textAlign: "center" }}>
                            {blockchain.errorMsg}
                          </s.TextDescription>
                        </>
                      ) : null}
                    </s.Container>
                  ) : (
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledNumberInput
                        value={mintQuantity}
                        onChange={(e) => setMintQuantity(e.target.value)} />
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs(mintQuantity);
                          getData();
                        } }
                      >
                        {claimingNft ? "SPOOKY..." : `Purchase ${mintQuantity} Pumpkinz NFT`}
                      </StyledButton>
                    </s.Container>
                  )}
                </>
              )}
            </s.Container>
          </ResponsiveWrapper>
          <s.SpacerSmall />
          <s.TextTitle style={{ textAlign: "center", fontSize: 16 }}>
            
          </s.TextTitle>


      </s.Container>
    </s.Screen>
  );
}

export default App;
