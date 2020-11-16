/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import ReactTable from '../Styled/Table';
import Peers from './Peers';

const setup = () => {
  const props = {
    peerList: [
      {
        channel_genesis_hash:
          'f3ed9c95452b184a4d5d66e25ba47f866ad6907a31f28f8067ca5596f64d8e0f',
        name: 'mychannel',
        requests: 'grpcs://127.0.0.1:7051',
        server_hostname: 'peer0.org1.example.com',
        mspid: 'Org1MSP',
        peer_type: 'PEER',
        ledger_height_high: '0',
        ledger_height_low: '0',
        ledger_height_unsigned: true,
      },
      {
        requests: 'grpcs://127.0.0.1:8051',
        server_hostname: 'peer1.org1.example.com',
        mspid: 'Org1MSP',
        peer_type: 'PEER',
        ledger_height_high: '0',
        ledger_height_low: '10',
        ledger_height_unsigned: true,
      },
      {
        requests: 'grpcs://127.0.0.1:9051',
        server_hostname: 'peer0.org2.example.com',
        mspid: 'Org2MSP',
        peer_type: 'PEER',
        ledger_height_high: '10',
        ledger_height_low: '0',
        ledger_height_unsigned: true,
      },
      {
        requests: 'grpcs://127.0.0.1:10051',
        server_hostname: 'peer1.org2.example.com',
        mspid: 'Org2MSP',
        peer_type: 'PEER',
        ledger_height_high: '10',
        ledger_height_low: '10',
        ledger_height_unsigned: false,
      },
    ],
  };

  const wrapper = mount(<Peers {...props} />);

  return {
    props,
    wrapper,
  };
};

describe('Peers', () => {
  test('Peers and ReactTable components should render', () => {
    const { wrapper } = setup();
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(ReactTable).exists()).toBe(true);
  });

  test('Table displays peer data', () => {
    const { wrapper } = setup();
    // Peer Names
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('peer0.org1.example.com'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('peer1.org1.example.com'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('peer0.org2.example.com'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('peer1.org2.example.com'))
        .exists(),
    ).toBe(true);
    // Request Url
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('grpcs://127.0.0.1:7051'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('grpcs://127.0.0.1:8051'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('grpcs://127.0.0.1:9051'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('grpcs://127.0.0.1:10051'))
        .exists(),
    ).toBe(true);
    // Peer Type
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('PEER'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('PEER'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('PEER'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('PEER'))
        .exists(),
    ).toBe(true);
    // MSPID
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('Org1MSP'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('Org1MSP'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('Org2MSP'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('Org2MSP'))
        .exists(),
    ).toBe(true);
    // Ledger Height (high)
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('10'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('0'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('10'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('10'))
        .exists(),
    ).toBe(true);
    // Ledger Height (low)
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('0'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('10'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('0'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('10'))
        .exists(),
    ).toBe(true);
    // Ledger Height (unsigned)
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('true'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('true'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('true'))
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('TdComponent')
        .findWhere(n => n.contains('false'))
        .exists(),
    ).toBe(true);
  });

  test('Simulate Peer Name filterMethod should have two result when given a value of peer0', () => {
    const { wrapper } = setup();
    wrapper
      .find('ThComponent')
      .findWhere(n => n.key() === '0-server_hostname')
      .find('input')
      .simulate('change', { target: { value: 'peer0' } });
    expect(wrapper.find(ReactTable).find('TrGroupComponent').length).toBe(2);
  });

  test('Simulate Request Url filterMethod should have one result when given a value of 9', () => {
    const { wrapper } = setup();
    wrapper
      .find('ThComponent')
      .findWhere(n => n.key() === '1-requests')
      .find('input')
      .simulate('change', { target: { value: '9' } });
    expect(wrapper.find(ReactTable).find('TrGroupComponent').length).toBe(1);
  });

  test('pagination when peerList is greater than 4', () => {
    const { wrapper, props } = setup();
    const { peerList } = props;
    const peer = {
      requests: 'grpcs://127.0.0.1:7051',
      server_hostname: 'peer0.org1.example.com',
      mspid: 'Org1MSP',
      peer_type: 'PEER',
      ledger_height_high: 10,
      ledger_height_low: 10,
      ledger_height_unsigned: true,
    };
    peerList.push(peer);
    expect(wrapper.find('.pagination-bottom').exists()).toBe(false);
    wrapper.setProps({ peerList });
    expect(wrapper.find('.pagination-bottom').exists()).toBe(true);
  });
});
