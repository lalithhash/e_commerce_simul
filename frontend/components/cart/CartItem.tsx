import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { CartItem as CartItemType, setCart } from '../../store/cartSlice';
import { useRemoveCartItem, useUpdateCartItem } from '../../lib/queries';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

interface CartItemProps {
  item: CartItemType;
  isUpdating: boolean;
}

export default function CartItem({ item, isUpdating }: CartItemProps) {
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    updateMutation.mutate({ id: item.id, quantity: newQuantity });
  };

  const handleRemove = () => {
    removeMutation.mutate(item.id);
  };

  const loading = updateMutation.isPending || removeMutation.isPending || isUpdating;

  return (
    <div className={`flex items-center gap-4 py-4 border-b ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-gray-50">
        <Image
          src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
          alt={item.product?.name || 'Product Image'}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <h4 className="font-medium text-sm line-clamp-1">{item.product?.name}</h4>
            <p className="text-sm font-semibold">₹{item.product?.price?.toLocaleString()}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={handleRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-7 w-7 rounded-sm"
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm w-4 text-center font-medium">{item.quantity}</span>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-7 w-7 rounded-sm"
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            disabled={item.quantity >= (item.product?.stock || 0)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 border-b">
      <Skeleton className="h-20 w-20 rounded-md" />
      <div className="flex flex-1 flex-col justify-between h-20">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-8 w-1/3 mt-2" />
      </div>
    </div>
  );
}
