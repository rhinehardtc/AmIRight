class PostsController < ApplicationController
    def index
        posts = Post.all
        render json: posts
    end

    def show
        post = Post.find_by(id: params[:id])
        post.save
        
        render json: post
    end

    def create
        post = Post.new(user_id: params[:user_id], content: params[:content])
        if post.valid?
            post.save
            render json: post
        else
            render json: {messge: 'something went wrong, try again'}
        end
    end
end
