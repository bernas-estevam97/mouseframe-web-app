from rest_framework import serializers
from mouseapp.models import SavedDistances


class SavedDistancesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedDistances
        fields = '__all__'



class SavedDistancesListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        # Maps for id->instance and id->data item.
        distance_mapping = {dist.id: dist for dist in instance}
        data_mapping = {item['id']: item for item in validated_data}

        # Perform creations and updates.
        ret = []
        for dist_id, data in data_mapping.items():
            dist = distance_mapping.get(dist_id, None)
            if dist is None:
                ret.append(self.child.create(data))
            else:
                ret.append(self.child.update(dist, data))

        # Perform deletions.
        for dist_id, dist in distance_mapping.items():
            if dist_id not in data_mapping:
                dist.delete()

        return ret
        




