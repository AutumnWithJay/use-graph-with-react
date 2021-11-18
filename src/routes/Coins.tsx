import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCoins } from '../api';
import { CoinInterface } from '../interfaces';

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
  margin-bottom: 10px;
  border-radius: 15px;
  background-color: white;
  color: ${(props) => props.theme.bgColor};
  a {
    display: flex;
    align-items: center;
    padding: 20px;
    transition: color 0.2 ease-in;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  display: flex;
  text-align: center;
`;

const Img = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

function Coins() {
  const { isLoading, data } = useQuery<CoinInterface[]>('allCoins', fetchCoins);

  return (
    <Container>
      <Helmet>
        <title>Coin List</title>
      </Helmet>
      <Header>
        <Title>Coin List</Title>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {data?.slice(0, 50).map((coin) => (
            <Coin key={coin.id}>
              <Link
                to={{
                  pathname: `/${coin.id}`,
                  state: { name: coin.name },
                }}
              >
                <Img
                  alt={`${coin.id} image`}
                  src={`https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                />
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}

export default Coins;
