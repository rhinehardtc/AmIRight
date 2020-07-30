class LikesController < ApplicationController

    def index
        likes = Like.all
        render json: likes
    end

    def show
        like = Like.find_by(id: params[:id])
        render json: like
    end

    def create
        like = Like.new(user_id: params[:user_id], post_id: params[:post_id], agree: params[:agree], disagree: params[:disagree])
        if like.valid?
            like.save
            render json: like
        else
            render json: {messge: 'something went wrong, try again'}
        end
    end

    def destroy
        Like.destroy(params[:id])
    end
end
