class LikeSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :post_id, :agree, :disagree
end
