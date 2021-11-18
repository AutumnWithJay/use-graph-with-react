import styled from 'styled-components';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet';
import { Route, Switch, useHistory, useLocation, useParams, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import { fetchCoinInfo, fetchCoinTickers } from '../api';
import Chart from './Chart';
import Price from './Price';
import { InfoData, RouteParams, RouteState, TickersData } from '../interfaces';

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 20px auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const GoBackLink = styled(Link)`
  margin: 10px 0;
  text-decoration: underline;
`;

const Loader = styled.span`
  display: flex;
  text-align: center;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  margin: 10px 0;
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) => (props.isActive ? props.theme.accentColor : props.theme.textColor)};
  a {
    display: block;
  }
`;

function Coin() {
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const priceMatch = useRouteMatch('/:coinId/price');
  const chartMatch = useRouteMatch('/:coinId/chart');
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(['info', coinId], () =>
    fetchCoinInfo(coinId),
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<TickersData>(
    ['tickers', coinId],
    () => fetchCoinTickers(coinId),
    {
      refetchInterval: 5000,
    },
  );

  const loading = infoLoading || tickersLoading;

  return (
    <Container>
      <Helmet>
        <title>{state?.name ? state.name : loading ? 'Loading...' : infoData?.name}</title>
      </Helmet>
      <Header>
        <Title>{state?.name ? state.name : loading ? 'Loading...' : infoData?.name}</Title>
        <GoBackLink to="/">Go Back</GoBackLink>
      </Header>

      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>{tickersData?.quotes.USD.price.toFixed(3)}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
          </Tabs>
          <Switch>
            <Route path={`/${coinId}/price`}>
              <Price coinId={coinId} />
            </Route>
            <Route path={`/${coinId}/chart`}>
              <Chart coinId={coinId} />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
}

export default Coin;
