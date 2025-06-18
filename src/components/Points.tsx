import React from 'react';
import { 
  Award, 
  Gift, 
  Star, 
  TrendingUp,
  Crown,
  Target,
  Zap
} from 'lucide-react';
import { User } from '../types';

interface PointsProps {
  user: User;
}

export const Points: React.FC<PointsProps> = ({ user }) => {
  const rewards = [
    {
      id: 1,
      name: 'Coffee Voucher',
      points: 500,
      description: 'Free coffee at participating cafes',
      icon: Gift,
      available: user.points >= 500
    },
    {
      id: 2,
      name: 'Eco Shopping Bag',
      points: 1000,
      description: 'Reusable shopping bag made from recycled materials',
      icon: Gift,
      available: user.points >= 1000
    },
    {
      id: 3,
      name: 'Plant a Tree',
      points: 1500,
      description: 'We plant a tree in your name',
      icon: Star,
      available: user.points >= 1500
    },
    {
      id: 4,
      name: 'Fine Immunity (1 week)',
      points: 2000,
      description: 'Temporary immunity from small fines',
      icon: Crown,
      available: user.points >= 2000
    }
  ];

  const achievements = [
    {
      title: 'First Scan',
      description: 'Scanned your first product',
      earned: true,
      icon: Target
    },
    {
      title: 'Eco Warrior',
      description: 'Earned 1000+ points',
      earned: user.points >= 1000,
      icon: Crown
    },
    {
      title: 'Streak Master',
      description: 'Scanned products 7 days in a row',
      earned: false,
      icon: Zap
    }
  ];

  const nextTier = user.points < 1000 ? 1000 : user.points < 2500 ? 2500 : 5000;
  const progress = (user.points / nextTier) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Rewards & Points</h1>
        <p className="text-gray-600">Earn points for responsible plastic disposal</p>
      </div>

      {/* Points Balance */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <p className="text-lg opacity-90">Your Points Balance</p>
            <p className="text-4xl font-bold">{user.points.toLocaleString()}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Progress to next tier</span>
              <span className="text-sm font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs mt-1 opacity-75">
              {nextTier - user.points} points to next tier
            </p>
          </div>
        </div>
      </div>

      {/* Available Rewards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Available Rewards</h2>
        <div className="space-y-3">
          {rewards.map((reward) => {
            const Icon = reward.icon;
            return (
              <div key={reward.id} className={`bg-white rounded-2xl p-4 shadow-sm border ${
                reward.available ? 'border-emerald-200' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${
                      reward.available ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{reward.name}</h3>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                      <p className="text-sm font-medium text-emerald-600">
                        {reward.points} points
                      </p>
                    </div>
                  </div>
                  <button
                    disabled={!reward.available}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      reward.available
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {reward.available ? 'Redeem' : 'Locked'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
        <div className="grid grid-cols-1 gap-3">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div key={index} className={`bg-white rounded-2xl p-4 shadow-sm border ${
                achievement.earned ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${
                    achievement.earned ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  {achievement.earned && (
                    <div className="text-yellow-600">
                      <Star className="w-6 h-6 fill-current" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};