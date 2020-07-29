class Post < ApplicationRecord
  belongs_to :user
  has_many :likes, through: :users
  has_many :dislikes, through: :users
end
