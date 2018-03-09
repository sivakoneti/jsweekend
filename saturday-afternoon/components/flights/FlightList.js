// @flow

import React, { Component } from "react";
import { graphql, QueryRenderer } from "react-relay";
import { Collapse } from "antd";

import environment from "../../lib/environment";
import FlightItem from "./FlightItem";
import FlightItemHeader from "./FlightItemHeader";

const query = graphql`
  query FlightListQuery($search: FlightsSearchInput!) {
    allFlights(search: $search, first: 5) {
      edges {
        cursor
        node {
          id
          departure {
            time
            airport {
              locationId
              city {
                name
              }
            }
          }
          arrival {
            time
            airport {
              locationId
              city {
                name
              }
            }
          }
          duration
          legs {
            id
            airline {
              name
              logoUrl
            }
            arrival {
              time
              localTime
              airport {
                name
                city {
                  name
                }
              }
            }
            departure {
              time
              localTime
              airport {
                name
                city {
                  name
                }
              }
            }
          }
          price {
            amount
            currency
          }
        }
      }
    }
  }
`;

type Props = {
  from: string,
  to: string,
  date: string
};

class FlightList extends Component<Props> {
  generateRender = ({ error, props }: Object) => {
    if (!error && !props) return <div>Loading</div>;
    if (error) return <div>Error happened: {error.message}</div>;

    return (
      <Collapse bordered={false}>
        {props.allFlights.edges.map(flight => (
          <Collapse.Panel
            key={flight.cursor}
            header={<FlightItemHeader flight={flight.node} />}
          >
            <FlightItem flight={flight.node} />
          </Collapse.Panel>
        ))}
      </Collapse>
    );
  };

  render() {
    const { from, to, date } = this.props;
    return (
      <div>
        <h2>
          List of flights from <em>{from}</em> to <em>{to}</em> on{" "}
          <em>{date}</em>
        </h2>
        <QueryRenderer
          environment={environment}
          query={query}
          variables={{
            search: {
              from: [{ location: from }],
              to: [{ location: to }],
              date: { exact: date }
            }
          }}
          render={this.generateRender}
        />
      </div>
    );
  }
}

export default FlightList;