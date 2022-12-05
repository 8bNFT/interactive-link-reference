<script>
    export let field, value

    import InlineLabel from "./InlineLabel.svelte";
</script>

<InlineLabel label={field.label} optional={field.optional}>
    <input type="checkbox" bind:checked={value}>
</InlineLabel>