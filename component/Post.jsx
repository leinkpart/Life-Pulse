import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-elements';
import { Entypo, AntDesign, Fontisto, Feather, FontAwesome } from '@expo/vector-icons';
import { combineTransition } from 'react-native-reanimated';

const Post = ({post}) => {
    return (
        <View style={{marginBottom: 30}}>
            <Divider width={1} orientation='vertical'/>
            <PostHeader post={post}/>
            <PostImage post={post} />
            <View style={{marginHorizontal: 15, marginTop: 10, }}>
                <PostFooter />
                <Likes post={post}/>
                <Caption post={post} />
                <CommentSection post={post} />
                <Comments post={post} />
            </View>           
        </View>
    )
}

const PostHeader = ({ post }) => {
    return (
        <View style={styles.postHeader}>
            <TouchableOpacity>
                <View style={styles.postHeaderCont}>
                    <Image source={{uri: post.profile_picture}} style={styles.story}/>
                    <Text style={styles.txtName}>
                        {post.user}
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={{marginRight: 15}}>
                <Entypo name='dots-three-horizontal' color='#fff' size={24} />
            </TouchableOpacity>
        </View>
    )  
}

const PostImage = ({ post }) => {
    return (
        <View style={styles.postImageCont}>
            <Image source={{uri: post.imageUrl}} style={styles.postImage}/>
        </View>
    )
}

const PostFooter = () => {
    return (
        <View style={styles.postFooterCont}>
            <View style={styles.postFooterIcon}>
                <TouchableOpacity>
                    <AntDesign name='hearto' color='#fff' size={24} style={styles.footerIcon}/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Fontisto name='comment' color='#fff' size={23} style={styles.footerIcon}/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Feather name='send' color='#fff' size={24} style={styles.footerIcon}/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity>
                <FontAwesome name='bookmark-o' color='#fff' size={24} style={styles.footerIcon}/>
            </TouchableOpacity>
        </View>
    )
}

const Likes = ({ post }) => {
    return (
        <View style={{flexDirection: 'row',}}>
            <Text style={{color: 'white', fontWeight: 600}}>
                {post.likes.toLocaleString('en')} likes
            </Text>
        </View>
    )
}

const Caption = ({ post }) => {
    return (
        <View style={{marginTop: 5}}> 
            <Text style={{color: 'white'}}>
                <Text style={styles.txtName}>{post.user}</Text>
                <Text>  {post.caption}</Text>
            </Text>
        </View>
    )
}

const CommentSection = ({ post }) => {
    return (
        <View style={{marginTop: 5}}>
            {!!post.comments.length && (
                <Text style={{color: 'gray'}}>
                    View {post.comments.length > 1 ? 'all' : ''} {post.comments.length}{' '}
                    {post.comments.length > 1 ? 'comments' : 'comment'}
                </Text>
            )}
        </View>
    )
}

const Comments = ({ post }) => {
    return (
        <>
            {post.comments.map((comment, index) => (
                <View key={index} style={{marginTop: 5, flexDirection: 'row'}}>
                    <Text style={{color: 'white'}}>
                        <Text style={{fontWeight: '700'}}>{comment.user}</Text> {' '}
                        {comment.comment}
                    </Text>
                </View>
            ))}
        </>
    )
}

const styles = StyleSheet.create({
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
        alignItems: 'center',
        marginBottom: 20
    },
    postHeaderCont: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    story: {
        width: 40,
        height: 40,
        marginLeft: 4,
        borderRadius: '50%',
        borderWidth: 3, 
        borderColor: '#ff8501',
    },
    txtName: {
        color: 'white',
        marginLeft: 5,
        fontWeight: '700',
    },
    postImageCont: {
        width: '99%',
        height: 500,
    },
    postImage: {
        height: '100%',
        resizeMode: 'cover',
        width: '100%'
    },
    postFooterCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    postFooterIcon: {
        flexDirection: 'row',
    },
    footerIcon: {
        margin: 10
    }
})

export default Post
