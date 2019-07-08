import React, { Component } from 'react';
import { TouchableOpacity, View, ScrollView, Image, StyleSheet } from 'react-native';

import gStyles from '../../constants/Styles';
import { getRemoteImagePath } from '../../utils/Helper';
import PageContent from '../../components/PageContent';
import RemoteImage from '../../components/RemoteImage';
import Text from '../../components/Text';

class Work extends Component {
  constructor(props) {
    super(props);
  }

  onComponentClick = item => {
    const { navigation } = this.props;
    console.log(item);
    navigation.navigate('Statistics', { id: item.id, title: item.title, queryParams: {} });
  };

  componentWillReceiveProps(nextProps) {
    const { navigation } = this.props;
    if (nextProps.work.link != this.props.work.link) {
      navigation.navigate('Web', { url: nextProps.work.link.url, title: nextProps.work.link.title });
    }
  }

  onLinkClick = item => {
    const { navigation, login, actions, work } = this.props;

    if (work.link.id == item.id) {
      navigation.navigate('Web', { url: work.link.url, title: item.title });
    } else {
      actions.fetchNetlink(login.auth.token, item.title, item.id);
    }
    //navigation.navigate('Web', { url: item.href, title: item.title });
  };

  renderComponent = (item, index) => {
    return (
      <TouchableOpacity key={index} style={styles.component} onPress={() => this.onComponentClick(item)}>
        <RemoteImage uri={getRemoteImagePath(item.imageID)} style={styles.componentImage} />
        <Text style={styles.componentTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  renderLinks = links => {
    return (
      <View style={styles.links}>
        <Text style={styles.linksLabel}>常用功能</Text>
        {links &&
          links.map((item, index) => {
            return (
              <TouchableOpacity key={index} style={styles.link} onPress={() => this.onLinkClick(item)}>
                <RemoteImage uri={getRemoteImagePath(item.imageID)} style={styles.linkImage} />
                <Text style={styles.linkTitle}>{item.title}</Text>
              </TouchableOpacity>
            );
          })}
      </View>
    );
  };

  render() {
    const { functions } = this.props;
    /*
    let components = [
      {
        name: 'statistics',
        icon: require('../../img/1.png'),
        title: '统计查询'
      },
      {
        name: 'salary',
        icon: require('../../img/2.png'),
        title: '我的工资'
      },
      {
        name: 'budget',
        icon: require('../../img/3.png'),
        title: '预算执行'
      }
    ];

    let links = [
      {
        icon: require('../../img/baidu.png'),
        title: '百度',
        href: 'http://www.baidu.com'
      },
      {
        icon: require('../../img/Google.png'),
        title: '谷歌',
        href: 'http://www.google.com.hk'
      },
      {
        icon: require('../../img/wangyi.png'),
        title: '网易',
        href: 'http://www.163.com'
      }
    ];
    */

    let components = Object.values(functions)
      .filter(item => item.typename && item.typename.toLowerCase() == 'query_function')
      .map(item => {
        return {
          id: item.id,
          title: item.title,
          imageID: item.imageID,
          icon: require('../../img/camera.png')
        };
      });

    let links = Object.values(functions)
      .filter(item => item.typename && item.typename.toLowerCase() == 'netlink')
      .map(item => {
        return {
          id: item.id,
          title: item.title,
          imageID: item.imageID
        };
      });

    console.log('components', components);
    console.log('links', links);

    return (
      <PageContent style={styles.container}>
        <ScrollView style={styles.components} horizontal={true} showsHorizontalScrollIndicator={false} bounces={false}>
          {components.map((item, index) => {
            return this.renderComponent(item, index);
          })}
        </ScrollView>
        <View style={styles.links}>{this.renderLinks(links)}</View>
      </PageContent>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  components: {
    backgroundColor: gStyles.color.sColor
  },
  component: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    marginVertical: 20,
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 5
  },
  componentImage: {
    width: 33,
    height: 33,
    marginBottom: 13,
    borderRadius: 5,
  },
  componentTitle: {
    fontSize: 15,
    color: gStyles.color.mTextColor,
    width: 80,
    textAlign: 'center'
  },
  links: {
    backgroundColor: gStyles.color.sColor,
    marginTop: 18
  },
  linksLabel: {
    fontSize: 16,
    color: '#4c4c4c',
    marginLeft: 27
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingLeft: 25,
    borderBottomColor: gStyles.color.mBorderColor,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  linkImage: {
    width: 23,
    height: 23,
    marginRight: 9,
    borderRadius:5,
  },
  linkTitle: {
    fontSize: 14,
    color: gStyles.color.sTextColor
  }
});

export default Work;
