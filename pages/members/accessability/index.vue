<template>
    <div class="card">
        <DataTable :value="products" tableStyle="min-width: 50rem">
            <Column field="code" header="Code"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="category" header="Category"></Column>
            <Column field="quantity" header="Quantity"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

onMounted(() => {
    products.value = [
        {
            code: 'A121',
            name: 'Hard Drive',
            category: 'Electronics',
            quantity: 1
        },
        {
            code: 'A121',
            name: 'Hard Drive',
            category: 'Electronics',
            quantity: 1
        }
    ]
});

const products = ref();

</script>