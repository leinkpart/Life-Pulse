import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import HeaderPost from "../../component/HeaderPost";
import Stories from "../../component/Stories";
import Post from "../../component/Post";
import POSTS from "../../data/POSTS";

const Article = () => {
    return (
        <SafeAreaView style={styles.container}>
            <HeaderPost />
            <Stories />
            <ScrollView style={{paddingBottom: 200}}>
                { POSTS.map((post, index) => (
                    <Post key={index} post={post} />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#040D12'
    }
});

export default Article